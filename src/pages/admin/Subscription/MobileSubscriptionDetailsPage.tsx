import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer';
import { colors } from '../../../theme/colors';

import PKImageDialog from '../../../components/modal/PkImageDialog';
import NoticeModal from '../../../components/modal/NoticeModal';
import StatusChipDropdown, {
  type PaymentStatus,
  type LicenseStatus as SubscriptionStatus,
} from '../../../components/chips/StatusChipDropdown';

import WarningIcon from '../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../assets/modalSuccess.svg?react';

import { ScrollableSection } from '../components/ScrollableSection';
import { useDisclosure } from '../../../hooks/useDisclosure';

import { useTeamSubHistory } from './hooks/useTeamSubHistory';
import { useUpdateSubStatus } from './hooks/useUpdateSubStatus';
import type { SubApiRow } from './api/subscriptions.types';

import {
  normalizePaymentStatus,
  normalizeSubscriptionStatus,
} from '../../../utils/helpers';

import type { DateRange } from 'react-day-picker';
import { subHistoryFieldData, type MobileSubHistoryRow } from './ui/fields';

// ===== helpers =====
const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  return `${dayjs(from).format('MMM D')} – ${dayjs(to).format('MMM D, YYYY')}`;
};

export default function MobileSubscriptionDetailsPage() {
  const p = useParams<{ team_id?: string }>();
  const teamId = p.team_id ? Number(p.team_id) : 0;

  // shared date range for everything on the page
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = fmt(start);
  const end_date = fmt(end);

  const dayPickerRange: DateRange | undefined = {
    from: start.toDate(),
    to: end.toDate(),
  };

  // fetch history (we’ll use the first row as “selected”)
  const { data, isLoading, isError } = useTeamSubHistory({
    team_id: teamId,
    page: 1,
    page_size: 10,
    start_date,
    end_date,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch subscription history.');
  }, [isError]);

  // currently selected entry (drives Payment + Confirmation)
  const [selected, setSelected] = useState<SubApiRow | null>(null);
  useEffect(() => {
    setSelected(data?.data?.[0] ?? null);
  }, [data]);

  // draft status values for the chips
  const [draftPayment, setDraftPayment] = useState<PaymentStatus>('pending');
  const [draftSub, setDraftSub] = useState<SubscriptionStatus>('pending');
  useEffect(() => {
    if (!selected) return;
    setDraftPayment(normalizePaymentStatus(selected.payment_status));
    setDraftSub(normalizeSubscriptionStatus(selected.subscription_status));
  }, [selected]);

  // dialogs
  const slip = useDisclosure(false);
  const confirm = useDisclosure(false);
  const success = useDisclosure(false);

  const { mutateAsync: updateSub, isPending } = useUpdateSubStatus();

  const handleConfirmUpdate = async () => {
    if (!selected) return;
    try {
      await updateSub({
        sub_id: selected.id,
        payment_status: draftPayment,
        subscription_status: draftSub,
      });
      confirm.onClose();
      success.onOpen();
    } catch {
      toast.error('Failed to update subscription status.');
    }
  };

  // ===== derived UI data =====
  const team = useMemo(() => {
    const t = data?.data?.[0]?.team;
    if (!t) return null;
    return {
      team_name: t.team_name ?? '—',
      phone_number: t.phone_number ?? '—',
      email: t.email ?? '—',
      country: t.country ?? '—',
      state: t.state ?? '—',
      address: t.address ?? '—',
    };
  }, [data]);

  const historyRows: MobileSubHistoryRow[] = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((r) => ({
      id: r.id,
      category: r.type || '—',
      payment_date: dayjs(r.payment_date).format('M/D/YYYY'),
      start_date: r.start_date ? dayjs(r.start_date).format('M/D/YYYY') : '—',
      end_date: r.end_date ? dayjs(r.end_date).format('M/D/YYYY') : '—',
    }));
  }, [data]);

  // ===== render =====
  return (
    <>
      {/* header row */}
      <Box
        sx={{
          px: 2,
          pt: 1,
          pb: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='mediumHeaderBold' sx={{ color: colors.Freeze }}>
          SUBSCRIPTION / SUBSCRIPTION DETAILS PAGE
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant='bodyTextMilkDefault'
            sx={{ color: colors.Freeze, opacity: 0.8 }}
          >
            {formatRangeLabel(dayPickerRange?.from, dayPickerRange?.to)}
          </Typography>
          <MetricsDateFilterDrawer
            range={dayPickerRange}
            title='Filter by time frame'
            onApply={(r) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
            }}
          />
        </Box>
      </Box>
      {/* TEAM details (simple stacked labels to match the mock) */}
      <Box sx={{ px: 2, mt: 1 }}>
        <Typography
          component='h2'
          sx={{ fontWeight: 900, color: '#fff', mb: 1 }}
        >
          TEAM details
        </Typography>

        {isLoading ? (
          <Box sx={{ maxWidth: 880 }}>
            <Skeleton height={22} width='60%' sx={{ mb: 2 }} />
            {[...Array(6)].map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton height={14} width='35%' />
                <Skeleton height={18} width='70%' sx={{ mt: 0.75 }} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ maxWidth: 880 }}>
            {[
              ['Team name', team?.team_name],
              ['Phone number', team?.phone_number],
              ['Country', team?.country],
              ['State', team?.state],
              ['Team email', team?.email],
              ['Address', team?.address],
            ].map(([label, value]) => (
              <Box key={label} sx={{ mb: 2.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                  {label}:
                </Typography>
                <Typography sx={{ color: '#A2A2A2', mt: 0.75, fontSize: 14 }}>
                  {value || 'complete your profile'}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      {/* PAYMENT details */}
      <Box id='payment-details' sx={{ px: 2, mt: 4 }}>
        <Typography
          component='h2'
          sx={{ fontWeight: 900, color: '#fff', mb: 2 }}
        >
          PAYMENT details
        </Typography>

        {/* Paid into / Paid from */}
        <Box sx={{ display: 'grid', gap: 3 }}>
          <BankGroup title='Paid into' bank={selected?.payment_into} />
          <BankGroup title='Paid from' bank={selected?.payment_from} />
        </Box>

        {/* Date / Amount */}
        <Box
          sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <LabeledValue
              label='Date and time'
              value={
                selected?.payment_date
                  ? `${dayjs(selected.payment_date).format(
                      'M/D/YYYY',
                    )}  ${dayjs(selected.payment_date).format('h:mma')}`
                  : 'N/A'
              }
            />
            <LabeledValue
              label='Amount paid'
              value={
                typeof selected?.payment_amount === 'number'
                  ? new Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency: 'NGN',
                      maximumFractionDigits: 2,
                    }).format(selected!.payment_amount)
                  : 'N/A'
              }
              highlight
            />
          </Box>
        </Box>

        {/* Subscription category */}
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#83E626' }}>
            Subscription category
          </Typography>
          <Typography sx={{ mt: 0.5, fontWeight: 600, color: '#83E626' }}>
            {selected?.type || '—'}
          </Typography>
        </Box>

        {/* Slip preview like the mock (framed img + “View”) */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>
            Payment slip
          </Typography>
          <Box
            sx={{
              width: '100%',
              maxWidth: 340,
              height: 420,
              border: '2px solid #1e88ff',
              borderRadius: 1.5,
              overflow: 'hidden',
              background: '#0b0b0b',
            }}
          >
            {selected?.payment_slip ? (
              <img
                src={selected.payment_slip}
                alt='Payment slip'
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#777',
                }}
              >
                No slip
              </Box>
            )}
          </Box>

          {selected?.payment_slip && (
            <Typography
              role='button'
              tabIndex={0}
              onClick={slip.onOpen}
              sx={{
                mt: 0.75,
                color: '#F6C10A',
                fontWeight: 700,
                cursor: 'pointer',
                width: 'fit-content',
              }}
            >
              View
            </Typography>
          )}
        </Box>
      </Box>
      {/* CONFIRMATION (chips) */}
      <Box sx={{ px: 2, mt: 5 }}>
        <Typography
          component='h2'
          sx={{ fontWeight: 900, color: '#fff', mb: 2 }}
        >
          CONFIRMATION
        </Typography>

        <Box sx={{ display: 'grid', gap: 3, maxWidth: 420 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>
              Payment confirmation status:
            </Typography>
            <StatusChipDropdown
              domain='payment'
              value={draftPayment}
              onChange={(next) => {
                const cur = normalizePaymentStatus(selected?.payment_status);
                setDraftPayment(next);
                if (next !== cur) confirm.onOpen();
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 1 }}>
              Licensing status:
            </Typography>
            <StatusChipDropdown
              domain='subscription'
              value={draftSub}
              onChange={(next) => {
                const cur = normalizeSubscriptionStatus(
                  selected?.subscription_status,
                );
                setDraftSub(next);
                if (next !== cur) confirm.onOpen();
              }}
            />
          </Box>
        </Box>
      </Box>
      {/* SUBSCRIPTION history (mobile list + eye icon) */}
      <ScrollableSection<MobileSubHistoryRow>
        title='SUBSCRIPTION history'
        items={historyRows}
        fields={subHistoryFieldData}
        searchKeys={['category', 'payment_date', 'start_date', 'end_date']}
        searchPlaceholder='Search history...'
        serverSearch
        loading={isLoading && historyRows.length === 0}
        hasMore={false}
        onSearchChange={() => {}}
        renderRight={(row) => (
          <IconButton
            aria-label='View'
            sx={{ color: '#fff', mt: 0.5 }}
            onClick={() => {
              const entry = data?.data?.find((x) => x.id === row.id) ?? null;
              setSelected(entry ?? null);
              document
                .getElementById('payment-details')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <VisibilityRounded />
          </IconButton>
        )}
      />
      {/* Slip fullscreen dialog (mobile style card) */}
      <PKImageDialog
        open={slip.open}
        onClose={slip.onClose}
        title='Payment slip'
        src={selected?.payment_slip ?? undefined}
        mobileCertificate
      />
      {/* Confirm / Success */}
      <NoticeModal
        open={confirm.open}
        onClose={confirm.onClose}
        onContinue={handleConfirmUpdate}
        onSecondary={confirm.onClose}
        title='NOTICE!!!'
        message={`Are you sure you want to update ${
          selected?.team?.team_name ?? 'this team'
        } subscription payment status?`}
        continueLabel={isPending ? 'Please wait…' : 'Update'}
        secondaryLabel='Cancel'
        icon={<WarningIcon />}
      />
      <NoticeModal
        open={success.open}
        onClose={success.onClose}
        onContinue={success.onClose}
        title='NOTICE!!!'
        message={`You have successfully updated ${
          selected?.team?.team_name ?? 'this team'
        } subscription status.`}
        continueLabel='Finish'
        icon={<SuccessIcon />}
      />
    </>
  );
}

/* ---------- tiny local bits ---------- */
function LabeledValue({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: 14,
          fontWeight: highlight ? 700 : 500,
          color: highlight ? '#00C853' : undefined,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function BankGroup({
  title,
  bank,
}: {
  title: string;
  bank?: {
    bank_name?: string | null;
    account_number?: string | null;
    account_name?: string | null;
  } | null;
}) {
  return (
    <Box>
      <Typography component='h3' sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
        {title}
      </Typography>
      <Box sx={{ mb: 1.25 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
          Bank name:
        </Typography>
        <Typography sx={{ color: '#A2A2A2', mt: 0.5, fontSize: 14 }}>
          {bank?.bank_name || 'N/A'}
        </Typography>
      </Box>
      <Box sx={{ mb: 1.25 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
          Account number:
        </Typography>
        <Typography sx={{ color: '#A2A2A2', mt: 0.5, fontSize: 14 }}>
          {bank?.account_number || 'N/A'}
        </Typography>
      </Box>
      <Box sx={{ mb: 1.25 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
          Account name:
        </Typography>
        <Typography sx={{ color: '#A2A2A2', mt: 0.5, fontSize: 14 }}>
          {bank?.account_name || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );
}
