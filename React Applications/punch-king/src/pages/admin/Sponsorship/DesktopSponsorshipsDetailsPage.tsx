// src/pages/admin/Sponsorships/DesktopSponsorshipDetailsPage.tsx
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Box } from '@mui/material';

import AdminSection from '../components/AdminSection';
import AdminBreadCrumbs from '../components/AdminBreadcrumbs';
import ROUTES from '../../../routes/routePath';

import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import type { DateRange } from 'react-day-picker';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';

import PKImageDialog from '../../../components/modal/PkImageDialog';
import NoticeModal from '../../../components/modal/NoticeModal';
import WarningIcon from '../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../assets/modalSuccess.svg?react';

import { useDisclosure } from '../../../hooks/useDisclosure';
import { useUpdateSponsorshipStatus } from './hooks/useUpdateSponsorshipStatus';

import {
  normalizePaymentStatus,
  normalizePurchaseStatus,
} from '../../../utils/helpers';

import type { PaymentStatus, PurchaseStatus, SponsorVoteRow } from './api/sponsorships.types';

import DesktopSponsorshipPaymentDetailsSection from './components/DesktopSponsorshipPaymentDetailsSection';
import DesktopSponsorshipConfirmationSection from './components/DesktopSponsorshipConfirmationSection';
import DesktopSponsorshipTeamDetailsSection from './components/DesktopSponsorshipTeamDetailsSection';
import { useSponsorPurchaseHistory } from './hooks/useSponsorPurchaseHistory';
import DesktopSponsorshipHistoryTable from './components/DesktopSponsorshipHistoryTable';
import { useSponsorVoteHistory } from './hooks/useSponsorVoteHistory';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

export default function DesktopSponsorshipDetailsPage() {
  // Expect route like: /admin/sponsorships/:sponsor_id/:purchase_id?  (purchase_id is optional)
  const { sponsor_id, purchase_id } = useParams<{
    sponsor_id?: string;
    purchase_id?: string;
  }>();
  const sponsorId = sponsor_id ? Number(sponsor_id) : 0;
  const purchaseId = purchase_id ? Number(purchase_id) : null;

  const qc = useQueryClient();

  // date range (mirrors subscription)
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  // fetch list-by-sponsor (source of truth for details)
  const page = 1; // 1-based
  const page_size = 10; // tweak as needed
  const { data, isLoading, isError } = useSponsorPurchaseHistory({
    sponsor_id: sponsorId,
    start_date,
    end_date,
    page,
    page_size,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch sponsorship history.');
  }, [isError]);

  // select entry (first or one matching :purchase_id if provided)
  const [selectedId, setSelectedId] = useState<number | null>(null);
  useEffect(() => {
    const rows = data?.data ?? [];
    if (!rows.length) {
      setSelectedId(null);
      return;
    }
    if (purchaseId != null) {
      const match = rows.find((r) => r.id === purchaseId);
      setSelectedId(match ? purchaseId : rows[0].id);
    } else {
      setSelectedId(rows[0].id);
    }
  }, [data, purchaseId]);

  const entry = useMemo(() => {
    const rows = data?.data ?? [];
    return rows.find((r) => r.id === selectedId) ?? null;
  }, [data, selectedId]);

  // dialogs
  const view = useDisclosure(false);
  const confirm = useDisclosure(false);
  const success = useDisclosure(false);

  // editable drafts
  const [draftPayment, setDraftPayment] = useState<PaymentStatus>('pending');
  const [draftPurchase, setDraftPurchase] = useState<PurchaseStatus>('pending');

  // sync drafts when entry changes
  useEffect(() => {
    if (!entry) return;
    setDraftPayment(normalizePaymentStatus(entry.payment_status));
    setDraftPurchase(normalizePurchaseStatus(entry.purchase_status));
  }, [entry]);

  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateSponsorshipStatus();

  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  const handleConfirmUpdate = async () => {
    if (!entry || isUpdating) return;
    await updateStatus(
      {
        purchase_id: entry.id,
        payment_status: draftPayment,
        purchase_status: draftPurchase,
      },
      {
        onSuccess: () => {
          // Invalidate the same key used by useSponsorPurchaseHistory
          qc.invalidateQueries({
            queryKey: [
              'sponsor-purchase-history',
              sponsorId,
              start_date,
              end_date,
              page,
              page_size,
            ],
          });
          qc.invalidateQueries({ queryKey: ['sponsorships'] }); // dashboard list, if visible elsewhere
        },
      }
    );
    confirm.onClose();
    success.onOpen();
  };

  const team = useMemo(() => {
    const t = entry?.team;
    if (!t) return null;
    return {
      team_name: t.team_name ?? t.username ?? null, // fall back to username per payload
      email: t.email ?? null,
      phone_number: t.phone_number ?? null,
      address: t.address ?? null,
      country: t.country ?? null,
      state: t.state ?? null,
    };
  }, [entry]);

  // server list state for history
  const [histPage, setHistPage] = useState(0); // UI 0-based
  const [histPageSize, setHistPageSize] = useState(10);
  const [histSearch, setHistSearch] = useState(''); // if backend ignores, still ok

  // fetch sponsor vote history (endpoint you shared)
  const {
    data: voteData,
    isLoading: voteLoading,
    isError: voteError,
  } = useSponsorVoteHistory({
    sponsor_id: sponsorId,
    page: histPage + 1, // API 1-based
    page_size: histPageSize,
    start_date,
    end_date,
    search: histSearch || undefined,
  });

  useEffect(() => {
    if (voteError) toast.error('Failed to fetch sponsorship history.');
  }, [voteError]);

  // map API -> table rows
  const voteRows: SponsorVoteRow[] = useMemo(() => {
    const list = voteData?.data ?? [];
    return list.map((it) => {
      const d = dayjs(it.created_at);
      const value = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
      }).format(it.equivalent_amount ?? 0);

      return {
        id: it.id,
        team_name: it.team_name,
        value,
        volume: it.units,
        date: d.format('M/D/YYYY'),
        time: d.format('h:mma'),
      };
    });
  }, [voteData]);

  const voteTotal = voteData?.metadata?.total_count ?? 0;

  useEffect(() => {
    setHistPage(0);
  }, [start_date, end_date]);

  return (
    <>
      <AdminSection
        title={
          <AdminBreadCrumbs
            rootLabel='SPONSORSHIPS'
            rootTo={ROUTES.SPONSORSHIP} // go back to sponsorship list page
            currentLabel='SPONSORSHIP DETAILS PAGE'
          />
        }
        toolbar={
          <DateRangeFilter
            range={dayPickerRange}
            onChange={(r?: DateRange) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
            }}
            icon={<DateFilterIcon />}
          />
        }
      >
        <DesktopSponsorshipTeamDetailsSection loading={isLoading} team={team} />
      </AdminSection>

      <Box
        sx={{
          padding: '1.56em 6.98em',
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '1.56em 2em',
            pl: '3em',
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            px: '1em',
            pl: '2rem',
          },
        }}
      >
        <DesktopSponsorshipPaymentDetailsSection
          loading={isLoading}
          entry={entry ?? undefined}
          onViewSlip={view.onOpen}
        />

        <DesktopSponsorshipConfirmationSection
          entry={entry ?? undefined}
          draftPayment={draftPayment}
          draftPurchase={draftPurchase}
          onChangePayment={(next) => {
            const cur = normalizePaymentStatus(entry?.payment_status);
            setDraftPayment(next);
            if (next !== cur) confirm.onOpen();
          }}
          onChangePurchase={(next) => {
            const cur = normalizePurchaseStatus(entry?.purchase_status);
            setDraftPurchase(next);
            if (next !== cur) confirm.onOpen();
          }}
        />

        <DesktopSponsorshipHistoryTable
          rows={voteRows}
          mode='server'
          loading={voteLoading}
          totalCount={voteTotal}
          pageIndex={histPage}
          rowsPerPage={histPageSize}
          onPageChange={setHistPage}
          onRowsPerPageChange={setHistPageSize}
          // if you want a search box in the header:
          searchValue={histSearch}
          onSearchChange={setHistSearch}
        />

        <PKImageDialog
          open={view.open}
          onClose={view.onClose}
          title='Payment slip'
          src={entry?.payment_slip ?? undefined}
        />

        <NoticeModal
          open={confirm.open}
          onClose={confirm.onClose}
          onContinue={handleConfirmUpdate}
          onSecondary={confirm.onClose}
          title='NOTICE!!!'
          message={`Are you sure you want to update ${
            entry?.team?.team_name ?? entry?.team?.username ?? 'this team'
          } sponsorship payment status?`}
          continueLabel={isUpdating ? 'Please wait…' : 'Update'}
          secondaryLabel='Cancel'
          icon={<WarningIcon />}
        />

        <NoticeModal
          open={success.open}
          onClose={success.onClose}
          onContinue={success.onClose}
          title='NOTICE!!!'
          message={`You have successfully updated ${
            entry?.team?.team_name ?? entry?.team?.username ?? 'this team'
          } sponsorship status.`}
          continueLabel='Finish'
          icon={<SuccessIcon />}
        />
      </Box>
    </>
  );
}
