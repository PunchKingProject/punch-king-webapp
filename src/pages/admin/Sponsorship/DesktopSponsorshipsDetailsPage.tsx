import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import ROUTES from '../../../routes/routePath.ts';
import AdminBreadCrumbs from '../components/AdminBreadcrumbs.tsx';
import AdminSection from '../components/AdminSection.tsx';

import type { DateRange } from 'react-day-picker';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DateRangeFilter from '../../../components/filters/DateRangeFilter.tsx';

import WarningIcon from '../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../assets/modalSuccess.svg?react';
import NoticeModal from '../../../components/modal/NoticeModal.tsx';
import PKImageDialog from '../../../components/modal/PkImageDialog.tsx';

import { useDisclosure } from '../../../hooks/useDisclosure.ts';
import { useUpdateSponsorshipStatus } from './hooks/useUpdateSponsorshipStatus.ts';

import {
  normalizePaymentStatus,
  normalizePurchaseStatus,
} from '../../../utils/helpers.ts';

import type {
  PaymentStatus,
  PurchaseStatus,
  SponsorVoteRow,
  SponsorshipApiRow,
} from './api/sponsorships.types.ts';

import DesktopSponsorshipConfirmationSection from './components/DesktopSponsorshipConfirmationSection.tsx';
import DesktopSponsorshipHistoryTable from './components/DesktopSponsorshipHistoryTable.tsx';
import DesktopSponsorshipPaymentDetailsSection from './components/DesktopSponsorshipPaymentDetailsSection.tsx';
import DesktopSponsorshipPaymentHistoryTable from './components/DesktopSponsorshipPaymentHistoryTable.tsx';
import DesktopSponsorshipTeamDetailsSection from './components/DesktopSponsorshipTeamDetailsSection.tsx';

import { useSponsorPurchaseHistory } from './hooks/useSponsorPurchaseHistory.ts';
import { useSponsorshipPurchase } from './hooks/useSponsorshipPurchase.ts';
import { useSponsorVoteHistory } from './hooks/useSponsorVoteHistory.ts';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

type TeamSnapshot = {
  team_name: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  country: string | null;
  state: string | null;
};

type LocationState = {
  teamSnapshot?: TeamSnapshot;
  sponsorId?: number | null;
};

export default function DesktopSponsorshipDetailsPage() {
  // Route uses purchase (object) id
  const { purchase_id } = useParams<{ purchase_id: string }>();
  const pid = Number(purchase_id);

  const { state } = useLocation();
  const { teamSnapshot, sponsorId } = (state as LocationState) || {};


  const qc = useQueryClient();

  // date range (kept to match design + feed server tables)
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  // ---- fetch the single purchase by id (NEW endpoint) ----
  const {
    data: entry,
    isLoading: purchaseLoading,
    isError: purchaseError,
  } = useSponsorshipPurchase(Number.isFinite(pid) ? pid : null);

  useEffect(() => {
    if (purchaseError) toast.error('Failed to fetch sponsorship details.');
  }, [purchaseError]);

  // dialogs
  const view = useDisclosure(false);
  const confirm = useDisclosure(false);
  const success = useDisclosure(false);

  // editable drafts
  const [draftPayment, setDraftPayment] = useState<PaymentStatus>('pending');
  const [draftPurchase, setDraftPurchase] = useState<PurchaseStatus>('pending');

  // sync drafts when entry loads/changes
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
          qc.invalidateQueries({ queryKey: ['sponsorships'] });
          qc.invalidateQueries({ queryKey: ['sponsorship', 'purchase'] });
          qc.invalidateQueries({ queryKey: ['sponsor-purchase-history'] });
          qc.invalidateQueries({ queryKey: ['sponsor-vote-history'] });
        },
      }
    );
    confirm.onClose();
    success.onOpen();
  };

  // ---------- Team card ----------
  const team = useMemo(() => {
    // Prefer snapshot (from previous page) for instant UI; fall back to entry.team
    if (teamSnapshot) return teamSnapshot;

    const t = entry?.team;
    if (!t) return null;
    return {
      team_name: t.team_name ?? t.username ?? null,
      email: t.email ?? null,
      phone_number: t.phone_number ?? null,
      address: t.address ?? null,
      country: t.country ?? null,
      state: t.state ?? null,
    };
  }, [teamSnapshot, entry]);

  // ---------- TABLE 1: Sponsorship PAYMENT history (users-purchase-history) ----------
  const [payPage, setPayPage] = useState(0); // UI 0-based
  const [payPageSize, setPayPageSize] = useState(10);
  const [paySearch, setPaySearch] = useState(''); // client-only search in PaginatedTable

  const {
    data: purchasePayload,
    isLoading: purchaseListLoading,
    isError: purchaseListError,
  } = useSponsorPurchaseHistory({
    sponsor_id: sponsorId ?? 0, // requires sponsor id from state
    start_date,
    end_date,
    page: payPage + 1,
    page_size: payPageSize,
  });

  useEffect(() => {
    if (purchaseListError && sponsorId) {
      toast.error('Failed to fetch sponsorship payment history.');
    }
  }, [purchaseListError, sponsorId]);

  const nf = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
      }),
    []
  );

  // Map API -> Payment table row
  const paymentRows = useMemo(() => {
    const rows = (purchasePayload?.data ?? []) as SponsorshipApiRow[];
    return rows.map((r) => ({
      id: r.id,
      username: r.team?.team_name ?? r.team?.username ?? '—',
      payment_date: dayjs(r.payment_date).format('M/D/YYYY'),
      amount_paid: nf.format(r.payment_amount ?? 0),
      units: r.sponsorship_points ?? 0,
      slip: r.payment_slip ?? null,
    }));
  }, [purchasePayload, nf]);

  const paymentTotal = purchasePayload?.metadata?.total_count ?? 0;

  // ---------- TABLE 2: Sponsorship HISTORY (sponsor-vote-history) ----------
  const [histPage, setHistPage] = useState(0);
  const [histPageSize, setHistPageSize] = useState(10);
  const [histSearch, setHistSearch] = useState('');

  const {
    data: voteData,
    isLoading: voteLoading,
    isError: voteError,
  } = useSponsorVoteHistory({
    sponsor_id: sponsorId ?? 0,
    page: histPage + 1,
    page_size: histPageSize,
    start_date,
    end_date,
    search: histSearch || undefined,
  });

  useEffect(() => {
    if (voteError && sponsorId) {
      toast.error('Failed to fetch sponsorship history.');
    }
  }, [voteError, sponsorId]);

  const voteRows: SponsorVoteRow[] = useMemo(() => {
    const list = voteData?.data ?? [];
    return list.map((it) => {
      const d = dayjs(it.created_at);
      const value = nf.format(it.equivalent_amount ?? 0);
      return {
        id: it.id,
        team_name: it.team_name,
        value,
        volume: it.units,
        date: d.format('M/D/YYYY'),
        time: d.format('h:mma'),
      };
    });
  }, [voteData, nf]);

  const voteTotal = voteData?.metadata?.total_count ?? 0;

  useEffect(() => {
    setPayPage(0);
    setHistPage(0);
  }, [start_date, end_date]);

  // ---- slip preview ----
  const [slipSrc, setSlipSrc] = useState<string | undefined>(undefined);
  const openSlip = (row: { slip?: string | null }) => {
    setSlipSrc(row.slip ?? undefined);
    view.onOpen();
  };

  return (
    <>
      <AdminSection
        title={
          <AdminBreadCrumbs
            rootLabel='SPONSORSHIPS'
            rootTo={ROUTES.SPONSORSHIP}
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
        <DesktopSponsorshipTeamDetailsSection
          loading={purchaseLoading}
          team={team}
        />
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
          loading={purchaseLoading}
          entry={entry ?? undefined}
          onViewSlip={() => openSlip({ slip: entry?.payment_slip })}
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

        {/* Table 1: Sponsorship PAYMENT history */}
        
          <DesktopSponsorshipPaymentHistoryTable
            rows={paymentRows}
            mode='server'
            loading={purchaseListLoading}
            totalCount={paymentTotal}
            pageIndex={payPage}
            rowsPerPage={payPageSize}
            onPageChange={setPayPage}
            onRowsPerPageChange={setPayPageSize}
            searchValue={paySearch}
            onSearchChange={setPaySearch}
            onViewSlip={openSlip}
          />


        {/* Table 2: Sponsorship HISTORY */}

          <DesktopSponsorshipHistoryTable
            rows={voteRows}
            mode='server'
            loading={voteLoading}
            totalCount={voteTotal}
            pageIndex={histPage}
            rowsPerPage={histPageSize}
            onPageChange={setHistPage}
            onRowsPerPageChange={setHistPageSize}
            searchValue={histSearch}
            onSearchChange={setHistSearch}
          />
    

        <PKImageDialog
          open={view.open}
          onClose={() => {
            view.onClose();
            setSlipSrc(undefined);
          }}
          title='Payment slip'
          src={slipSrc ?? entry?.payment_slip ?? undefined}
        />

        <NoticeModal
          open={confirm.open}
          onClose={confirm.onClose}
          onContinue={handleConfirmUpdate}
          onSecondary={confirm.onClose}
          title='NOTICE!!!'
          message='Are you sure you want to update this sponsorship payment status?'
          continueLabel={isUpdating ? 'Please wait…' : 'Update'}
          secondaryLabel='Cancel'
          icon={<WarningIcon />}
        />

        <NoticeModal
          open={success.open}
          onClose={success.onClose}
          onContinue={success.onClose}
          title='NOTICE!!!'
          message='You have successfully updated the sponsorship status.'
          continueLabel='Finish'
          icon={<SuccessIcon />}
        />
      </Box>
    </>
  );
}
