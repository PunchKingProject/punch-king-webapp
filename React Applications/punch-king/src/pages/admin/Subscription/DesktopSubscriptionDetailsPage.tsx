import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import AdminSection from '../components/AdminSection';
import AdminBreadCrumbs from '../components/AdminBreadcrumbs';
import ROUTES from '../../../routes/routePath';

import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import type { DateRange } from 'react-day-picker';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';

import { useTeamSubHistory } from './hooks/useTeamSubHistory';

import PKImageDialog from '../../../components/modal/PkImageDialog';
import NoticeModal from '../../../components/modal/NoticeModal';
import StatusChipDropdown, {
  type PaymentStatus,
  type LicenseStatus as SubscriptionStatus,
} from '../../../components/chips/StatusChipDropdown';

import WarningIcon from '../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../assets/modalSuccess.svg?react';
import { Box, Typography } from '@mui/material';
import { useDisclosure } from '../../../hooks/useDisclosure';
import type { SubApiRow } from './api/subscriptions.types';
import type { SubHistoryRow } from './components/DesktopSubscriptionHistoryTable';
import DesktopSubscriptionPaymentDetailsSection from './components/DesktopSubscriptionPaymentDetailsSection';
import DesktopSubscriptionConfirmationSection from './components/DesktopSubscriptionConfirmationSection';
import DesktopSubscriptionHistoryTable from './components/DesktopSubscriptionHistoryTable';
import { useUpdateSubStatus } from './hooks/useUpdateSubStatus';
import DesktopSubscriptionTeamDetailsSection from './components/DesktopSubscriptionTeamDetailsSection';
import { useQueryClient } from '@tanstack/react-query';
import {
  normalizePaymentStatus,
  normalizeSubscriptionStatus,
} from '../../../utils/helpers';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

export default function DesktopSubscriptionDetailsPage() {
  const { team_id } = useParams<{ team_id?: string }>();
  const teamId = team_id ? Number(team_id) : 0;
  const qc = useQueryClient();

  // date range (shared)
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  // table plumbing (for history)
  const [page] = useState(0);
  const [pageSize] = useState(10);

  const { data, isLoading, isError } = useTeamSubHistory({
    team_id: teamId,
    page: page + 1,
    page_size: pageSize,
    start_date,
    end_date,
  });

  const [selected, setSelected] = useState<SubApiRow | null>(null);

  // dialogs
  const view = useDisclosure(false);
  const confirm = useDisclosure(false);
  const success = useDisclosure(false);

  // editable drafts for status
  const [draftPayment, setDraftPayment] = useState<PaymentStatus>('pending');
  const [draftSub, setDraftSub] = useState<SubscriptionStatus>('pending');

  const { mutateAsync: updateSub, isPending: isUpdating } =
    useUpdateSubStatus();

  // load defaults
  useEffect(() => {
    const first = data?.data?.[0] ?? null;
    setSelected(first);
  }, [data]);

  useEffect(() => {
    if (isError) toast.error('Failed to fetch subscription history.');
  }, [isError]);

  // sync drafts from selected
  useEffect(() => {
    if (!selected) return;
    setDraftPayment(normalizePaymentStatus(selected.payment_status));
    setDraftSub(normalizeSubscriptionStatus(selected.subscription_status));
  }, [selected]);

  // team header block
  const team = useMemo(() => {
    const t = data?.data?.[0]?.team;
    if (!t) return null;
    return {
      team_name: t.team_name ?? null,
      email: t.email ?? null,
      phone_number: t.phone_number ?? null,
      address: t.address ?? null,
      country: t.country ?? null,
      state: t.state ?? null,
    };
  }, [data]);



  // history mapping
  const historyRows: SubHistoryRow[] = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((r) => ({
      id: r.id,
      category: r.type || '—',
      payment_date: dayjs(r.payment_date).format('M/D/YYYY'),
      start_date: r.start_date ? dayjs(r.start_date).format('M/D/YYYY') : '—',
      end_date: r.end_date ? dayjs(r.end_date).format('M/D/YYYY') : '—',
    }));
  }, [data]);

  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  // patch confirm
  const handleConfirmUpdate = async () => {
    if (!selected || isUpdating) return;
    await updateSub(
      {
        sub_id: selected.id,
        payment_status: draftPayment,
        subscription_status: draftSub,
      },
      {
        onSuccess: () => {
          // keep cache correct
          qc.invalidateQueries({ queryKey: ['subs'] });
          qc.invalidateQueries({ queryKey: ['team-sub-history', teamId] });
        },
      }
    );
    confirm.onClose();
    success.onOpen();
  };

  return (
    <>
      <AdminSection
        title={
          <AdminBreadCrumbs
            rootLabel='SUBSCRIPTION'
            rootTo={ROUTES.SUBSCRIPTION}
            currentLabel='SUBSCRIPTION DETAILS PAGE'
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
        <DesktopSubscriptionTeamDetailsSection
          loading={isLoading}
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
        {/* Payment details + confirmation for selected record */}
        <DesktopSubscriptionPaymentDetailsSection
          loading={isLoading}
          entry={selected ?? undefined}
          onViewSlip={view.onOpen}
        />

        <DesktopSubscriptionConfirmationSection
          entry={selected ?? undefined}
          draftPayment={draftPayment}
          draftSub={draftSub}
          onChangePayment={(next) => {
            const cur = normalizePaymentStatus(selected?.payment_status);
            setDraftPayment(next);
            if (next !== cur) confirm.onOpen();
          }}
          onChangeSub={(next) => {
            const cur = normalizeSubscriptionStatus(
              selected?.subscription_status
            );
            setDraftSub(next);
            if (next !== cur) confirm.onOpen();
          }}
          onConfirm={confirm.onOpen}
        />

        <DesktopSubscriptionHistoryTable
          rows={historyRows}
          onView={(row) => {
            const entry = data?.data?.find((x) => x.id === row.id) ?? null;
            setSelected(entry);
            document
              .getElementById('payment-details')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Slip dialog with editors */}
        <PKImageDialog
          open={view.open}
          onClose={view.onClose}
          title='Payment slip'
          src={selected?.payment_slip ?? undefined}
          actions={
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 13, mb: 0.5 }}>
                  Payment confirmation status:
                </Typography>
                <StatusChipDropdown
                  domain='payment'
                  value={draftPayment}
                  onChange={(n) => {
                    const cur = normalizePaymentStatus(
                      selected?.payment_status
                    );
                    setDraftPayment(n);
                    if (n !== cur) confirm.onOpen();
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 13, mb: 0.5 }}>
                  Subscription status:
                </Typography>
                <StatusChipDropdown
                  domain='subscription'
                  value={draftSub}
                  onChange={(n) => {
                    const cur = normalizeSubscriptionStatus(
                      selected?.subscription_status
                    );
                    setDraftSub(n);
                    if (n !== cur) confirm.onOpen();
                  }}
                />
              </Box>
            </Box>
          }
        />

        {/* Confirm + Success modals */}
        <NoticeModal
          open={confirm.open}
          onClose={confirm.onClose}
          onContinue={handleConfirmUpdate}
          onSecondary={confirm.onClose}
          title='NOTICE!!!'
          message={`Are you sure you want to update ${
            selected?.team?.team_name ?? 'this team'
          } subscription payment status?`}
          continueLabel={isUpdating ? 'Please wait…' : 'Update'}
          secondaryLabel='Cancel'
          icon={<WarningIcon />}
        />

        <NoticeModal
          open={success.open}
          onClose={success.onClose}
          onContinue={() => {
            success.onClose();
            view.onClose();
          }}
          title='NOTICE!!!'
          message={`You have successfully updated ${
            selected?.team?.team_name ?? 'this team'
          } subscription status.`}
          continueLabel='Finish'
          icon={<SuccessIcon />}
        />
      </Box>
    </>
  );
}
