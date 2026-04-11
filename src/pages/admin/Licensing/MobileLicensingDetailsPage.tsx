import { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import dayjs, { Dayjs } from 'dayjs';
import type { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import MetricsDateFilterDrawer from '../Dashboard/components/MetricsDateFilterDrawer.tsx';
import { ScrollableSection } from '../components/ScrollableSection.tsx';
import { useTeamLicenseHistory } from './hooks/useTeamLicenseHistory.ts';
import type { LicenseApiRow } from './api/licensing.types.ts';
import PKImageDialog from '../../../components/modal/PkImageDialog.tsx';
import NoticeModal from '../../../components/modal/NoticeModal.tsx';
import StatusChipDropdown, {
  type LicenseStatus,
  type PaymentStatus,
} from '../../../components/chips/StatusChipDropdown.tsx';
import { useUpdateLicenseStatus } from './hooks/useUpdateLicenseStatus.ts';
import WarningIcon from '../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../assets/modalSuccess.svg?react';
import { historyFieldData, type HistoryRow } from './ui/fields.ts';
import { colors } from '../../../theme/colors.ts';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');
const formatRangeLabel = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Last 30 days';
  return `${dayjs(from).format('MMM D')} – ${dayjs(to).format('MMM D, YYYY')}`;
};


export default function MobileLicensingDetailsPage() {
  const { team_id } = useParams<{ team_id?: string }>();
  const teamId = team_id ? Number(team_id) : 0;

  // shared date range for page
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

  // fetch license history
  const { data, isError, isLoading } = useTeamLicenseHistory({
    team_id: teamId,
    page: 1,
    page_size: 50,
    start_date,
    end_date,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch license history.');
  }, [isError]);

  // current selection drives Payment + Confirmation
  const [selected, setSelected] = useState<LicenseApiRow | null>(null);
  useEffect(() => {
    setSelected(data?.data?.[0] ?? null);
  }, [data]);

  // dialogs
  const [slipOpen, setSlipOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // chip drafts
  const [draftPayment, setDraftPayment] = useState<PaymentStatus>('pending');
  const [draftLicense, setDraftLicense] = useState<LicenseStatus>('pending');

  useEffect(() => {
    if (!selected) return;
    setDraftPayment(
      (
        (selected.payment_status ?? 'pending') as string
      ).toLowerCase() as PaymentStatus
    );
    setDraftLicense(
      (
        (selected.license_status ?? 'pending') as string
      ).toLowerCase() as LicenseStatus
    );
  }, [selected]);

  const { mutateAsync: doUpdate, isPending } = useUpdateLicenseStatus();

  const handleConfirmUpdate = async () => {
    if (!selected) return;
    try {
      await doUpdate({
        license_id: selected.id,
        payment_status: draftPayment,
        license_status: draftLicense,
      });
      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch {
      toast.error('Failed to update license status.');
    }
  };

  // team block data
  const team = useMemo(() => {
    const t = selected?.team ?? data?.data?.[0]?.team;
    return {
      team_name: t?.team_name ?? undefined,
      email: t?.email ?? undefined,
      phone_number: t?.phone_number ?? undefined,
      address: t?.address ?? undefined,
      country: t?.country ?? undefined,
      state: t?.state ?? undefined,
    };
  }, [selected, data]);

  // history rows for list
  const historyRows: HistoryRow[] = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((r) => ({
      id: r.id,
      licensing_name: r.team?.license_number
        ? `Licensing ${r.team.license_number}`
        : 'Licensing',
      payment_date: dayjs(r.payment_date).format('M/D/YYYY'),
      start_date: r.start_date ? dayjs(r.start_date).format('M/D/YYYY') : '—',
      end_date: r.end_date ? dayjs(r.end_date).format('M/D/YYYY') : '—',
    }));
  }, [data]);

  return (
    <>
      {/* HEADER */}
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
          LICENSING / LICENSING DETAILS PAGE
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
            title='Filter timeframe'
            onApply={(r) => {
              if (!r?.from || !r.to) return;
              setRange([dayjs(r.from), dayjs(r.to)]);
            }}
          />
        </Box>
      </Box>

      {/* TEAM details */}
      <Box sx={{ px: 2, mt: 1 }}>
        <Typography variant='h6' sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>
          TEAM details
        </Typography>

        {[
          { label: 'Team name', value: team.team_name },
          { label: 'Phone number', value: team.phone_number },
          { label: 'Country', value: team.country },
          { label: 'State', value: team.state },
          { label: 'Team email', value: team.email },
          { label: 'Address', value: team.address },
        ].map((r) => (
          <Box key={r.label} sx={{ mb: 1.25 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>
              {r.label}:
            </Typography>
            <Typography sx={{ color: '#A2A2A2', mt: 0.5, fontSize: 14 }}>
              {r.value || 'complete your profile'}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* PAYMENT details (compact) */}
      <Box sx={{ px: 2, mt: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>
          PAYMENT details
        </Typography>

        <Box sx={{ display: 'grid', gap: 1.25 }}>
          <Field
            label='Paid into - Bank name'
            value={selected?.payment_into?.bank_name}
          />
          <Field
            label='Account number'
            value={selected?.payment_into?.account_number}
          />
          <Field
            label='Account name'
            value={selected?.payment_into?.account_name}
          />

          <Field
            label='Paid from - Bank name'
            value={selected?.payment_from?.bank_name}
          />
          <Field
            label='Account number'
            value={selected?.payment_from?.account_number}
          />
          <Field
            label='Account name'
            value={selected?.payment_from?.account_name}
          />

          <Field
            label='Date and time'
            value={
              selected?.payment_date
                ? `${dayjs(selected.payment_date).format('M/D/YYYY')}  ${dayjs(
                    selected.payment_date
                  ).format('h:mma')}`
                : 'N/A'
            }
          />

          <Field
            label='Amount paid'
            value={
              typeof selected?.payment_amount === 'number'
                ? new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2,
                  }).format(selected.payment_amount)
                : 'N/A'
            }
            highlight
          />

          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>
              Payment slip
            </Typography>

            <Box
              sx={{
                mt: 1,
                width: '100%',
                maxWidth: 360, // looks good on small screens
                aspectRatio: '3 / 5', // portraity frame like your mock
                borderRadius: 1.5,
                overflow: 'hidden',
                // thin blue frame per your screenshot; tweak to your theme if needed
                border: '2px solid #2F7AE5',
                background: '#111',
                display: 'grid',
                placeItems: 'center',
                cursor: selected?.payment_slip ? 'pointer' : 'default',
              }}
              onClick={() => selected?.payment_slip && setSlipOpen(true)}
            >
              {isLoading ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(255,255,255,0.04)',
                  }}
                />
              ) : selected?.payment_slip ? (
                <img
                  src={selected.payment_slip}
                  alt='Payment slip'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Typography sx={{ color: '#A2A2A2', fontSize: 14 }}>
                  No slip
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 1 }}>
              {selected?.payment_slip ? (
                <Typography
                  onClick={() => setSlipOpen(true)}
                  sx={{ color: '#f0c040', fontWeight: 700, cursor: 'pointer' }}
                >
                  View
                </Typography>
              ) : (
                <Typography sx={{ color: '#A2A2A2' }}>No slip</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CONFIRMATION (chips + confirm modal) */}
      <Box sx={{ px: 2, mt: 4 }}>
        <Typography variant='h6' sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>
          CONFIRMATION
        </Typography>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 0.75 }}>
              Payment confirmation status:
            </Typography>
            <StatusChipDropdown
              domain='payment'
              value={draftPayment}
              onChange={(v) => {
                setDraftPayment(v);
                setConfirmOpen(true);
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 0.75 }}>
              Licensing status:
            </Typography>
            <StatusChipDropdown
              domain='license'
              value={draftLicense}
              onChange={(v) => {
                setDraftLicense(v);
                setConfirmOpen(true);
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* SUBSCRIPTION history (server list-like, but we already have all rows here) */}
      <ScrollableSection<HistoryRow>
        title='SUBSCRIPTION history'
        items={historyRows}
        fields={historyFieldData}
        searchKeys={[
          'licensing_name',
          'payment_date',
          'start_date',
          'end_date',
        ]}
        searchPlaceholder='Search subscriptions...'
        // local mode (no server props)
        getItemKey={(r) => r.id}
        renderRight={(r) => (
          <IconButton
            aria-label='view'
            onClick={() => {
              const entry = data?.data?.find((x) => x.id === r.id) ?? null;
              setSelected(entry);
              setSlipOpen(true);
            }}
            sx={{ color: '#fff', mt: 0.5 }}
          >
            <VisibilityRounded />
          </IconButton>
        )}
      />

      {/* Slip viewer */}
      <PKImageDialog
        open={slipOpen}
        onClose={() => setSlipOpen(false)}
        title='Payment slip'
        src={selected?.payment_slip ?? undefined}
        mobileCertificate
        actions={null}
      />

      {/* Confirm + Success modals */}
      <NoticeModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onContinue={handleConfirmUpdate}
        onSecondary={() => setConfirmOpen(false)}
        title='NOTICE!!!'
        message={`Are you sure you want to update ${
          selected?.team?.team_name ?? 'this team'
        } subscription status?`}
        continueLabel={isPending ? 'Please wait…' : 'Update'}
        secondaryLabel='Cancel'
        icon={<WarningIcon />}
      />
      <NoticeModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onContinue={() => setSuccessOpen(false)}
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

/* small helpers */
function Field({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value?: string | null;
  highlight?: boolean;
}) {
  return (
    <Box sx={{ mb: 1.25 }}>
      <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: 14,
          fontWeight: highlight ? 700 : 500,
          color: highlight ? '#00C853' : '#A2A2A2',
        }}
      >
        {value || 'N/A'}
      </Typography>
    </Box>
  );
}

