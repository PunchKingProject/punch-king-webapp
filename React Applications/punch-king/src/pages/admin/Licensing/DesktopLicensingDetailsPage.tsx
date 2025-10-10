import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeamLicenseHistory } from './hooks/useTeamLicenseHistory';
import { toast } from 'react-toastify';
import AdminSection from '../components/AdminSection';
import AdminBreadCrumbs from '../components/AdminBreadcrumbs';
import ROUTES from '../../../routes/routePath';
import DateRangeFilter from '../../../components/filters/DateRangeFilter';
import type { DateRange } from 'react-day-picker';
import DateFilterIcon from '../../../assets/filterTimeFrameIcon.svg?react';
import DesktopLicenseTeamDetailsSection from './components/DesktopLicenseTeamDetailsSection';
import type { LicenseHistoryRow } from './components/DesktopLicensingHistoryTable';
import DesktopLicensingHistoryTable from './components/DesktopLicensingHistoryTable';
import { Box, Typography } from '@mui/material';
import type { LicenseApiRow } from './api/licensing.types';
import DesktopLicensePaymentDetailsSection from './components/DesktopLicensePaymentDetailsSection';
import DesktopLicenseConfirmationSection from './components/DesktopLicenseConfirmationSection';
import type {
  LicenseStatus,
  PaymentStatus,
} from '../../../components/chips/StatusChipDropdown';
import { useUpdateLicenseStatus } from './hooks/useUpdateLicenseStatus';
import NoticeModal from '../../../components/modal/NoticeModal';
import StatusChipDropdown from '../../../components/chips/StatusChipDropdown';
import PKImageDialog from '../../../components/modal/PkImageDialog';
import WarningIcon from '../../../assets/modalQuestionIcon.svg?react';
import SuccessIcon from '../../../assets/modalSuccess.svg?react';
import { useDisclosure } from '../../../hooks/useDisclosure';

const fmt = (d: Dayjs) => d.format('YYYY-MM-DD');

const DesktopLicensingDetailsPage = () => {
  //   const details: TeamDetails = {
  //     teamName: '',
  //     teamEmail: '',
  //     phone: '',
  //     address: '',
  //     country: '',
  //     state: '',x
  //   };

  const { team_id } = useParams<{ team_id?: string }>();
  const teamId = team_id ? Number(team_id) : 0;

  // shared date range
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [start, end] = range;
  const start_date = useMemo(() => fmt(start), [start]);
  const end_date = useMemo(() => fmt(end), [end]);

  // server table state (we’ll use it later for the history table)
  const [page] = useState(0);
  const [pageSize] = useState(10);

  // fetch the license history (we only need the first record’s team for this section)
  const { data, isLoading, isError } = useTeamLicenseHistory({
    team_id: teamId,
    page: page + 1,
    page_size: pageSize,
    start_date,
    end_date,
  });

  // selected entry (drives Payment + Confirmation)
  const [selected, setSelected] = useState<LicenseApiRow | null>(null);

  // dialog + editing state
  const [draftPayment, setDraftPayment] = useState<PaymentStatus>('pending');
  const [draftLicense, setDraftLicense] = useState<LicenseStatus>('pending');

  const view = useDisclosure(false);
  const confirm = useDisclosure(false);
  const success = useDisclosure(false);

  const { mutateAsync: doUpdate, isPending: isUpdating } =
    useUpdateLicenseStatus();

  // keep selected in sync with data: default to first row
  useEffect(() => {
    const first = data?.data?.[0] ?? null;
    setSelected(first);
  }, [data]);

  useEffect(() => {
    if (isError) toast.error('Failed to fetch license history.');
  }, [isError]);

  // 👉 Derive the team details for the header section
  const team = useMemo(() => {
    const first = data?.data?.[0]?.team;
    if (!first) return null;
    return {
      team_name: first.team_name ?? null,
      email: first.email ?? null,
      phone_number: first.phone_number ?? null,
      address: first.address ?? null,
      country: first.country ?? null,
      state: first.state ?? null,
    };
  }, [data]);

  const dayPickerRange: DateRange | undefined = {
    from: range[0].toDate(),
    to: range[1].toDate(),
  };

  const historyRows: LicenseHistoryRow[] = useMemo(() => {
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

  // keep drafts in sync with selected row
  useEffect(() => {
    if (!selected) return;
    const p = (
      selected.payment_status ?? 'pending'
    ).toLowerCase() as PaymentStatus;
    const l = (
      selected.license_status ?? 'pending'
    ).toLowerCase() as LicenseStatus;
    setDraftPayment(p);
    setDraftLicense(l);
  }, [selected]);

  // // when a row is viewed
  // const handleViewClick = (row: LicenseHistoryRow) => {
  //   const entry = data?.data?.find((x) => x.id === row.id) ?? null;
  //   setSelected(entry);
  //   view.onOpen(); // 👈 open slip dialog
  // };

  // confirm update → PATCH
  const handleConfirmUpdate = async () => {
    if (!selected) return;
    try {
      await doUpdate({
        license_id: selected.id,
        payment_status: draftPayment,
        license_status: draftLicense,
      });
      confirm.onClose();
      success.onOpen();
    } catch (e) {
      console.log(e)
      toast.error('Failed to update license status.');
    }
  };
  return (
    <>
      <AdminSection
        title={
          <>
            <AdminBreadCrumbs
              rootLabel='LICENSING'
              rootTo={ROUTES.LICENSING}
              currentLabel='LICENSING DETAILS PAGE'
            />
          </>
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
        {/* <Box
          sx={{
            border: '2px solid red',
          }}
        > */}
        {/* <Typography
            component={'h1'}
            variant='h1'
            sx={{
              fontWeight: 900,
            }}
          >
            TEAM DETAILS
          </Typography> */}

        {/* Two-column detail grid */}
        {/* <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              maxWidth: 880,
              mx: 0, // keep aligned with content column
            }}
          > */}
        {/* Left column */}
        {/* <Box> */}
        {/* {row('Team name', details.teamName)}
              {row('Phone number', details.phone)}
              {row('Country', details.country)} */}
        {/* </Box> */}

        {/* Right column */}
        {/* <Box> */}
        {/* {row('Team email', details.teamEmail)}
              {row('Address', details.address)}
              {row('State', details.state)} */}
        {/* </Box> */}
        {/* </Box> */}
        {/* </Box> */}
        {/* The TEAM DETAILS block (matches your mock) */}
        <DesktopLicenseTeamDetailsSection loading={isLoading} team={team} />
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
        {/* PAYMENT DETAILS + CONFIRMATION bound to selected row */}
        <DesktopLicensePaymentDetailsSection
          loading={isLoading}
          entry={selected}
          onViewSlip={() => {
            view.onOpen();
          }}
        />
        <DesktopLicenseConfirmationSection entry={selected} />

        <DesktopLicensingHistoryTable
          rows={historyRows}
          onView={(row) => {
            console.log(row);
            const entry = data?.data?.find((x) => x.id === row.id) ?? null;
            setSelected(entry);

            // optional: scroll the payment/confirmation into view
            document
              .getElementById('payment-details')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Slip dialog with status editors */}
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
                  onChange={(next) => {
                    setDraftPayment(next);
                    confirm.onOpen();
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 13, mb: 0.5 }}>
                  Subscription status:
                </Typography>
                <StatusChipDropdown
                  domain='license'
                  value={draftLicense}
                  onChange={(next) => {
                    setDraftLicense(next);
                    confirm.onOpen();
                  }}
                />
              </Box>
            </Box>
          }
        />

        {/* Confirm update */}
        <NoticeModal
          open={confirm.open}
          onClose={confirm.onClose}
          onContinue={handleConfirmUpdate}
          onSecondary={confirm.onClose}
          title='NOTICE!!!'
          message={`Are you sure you want to update ${
            selected?.team?.team_name ?? 'this team'
          } license payment status?`}
          continueLabel={isUpdating ? 'Please wait…' : 'Update'}
          secondaryLabel='Cancel'
          icon={<WarningIcon />}
        />

        {/* Success */}
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
          } license payment status.`}
          continueLabel='Finish'
          icon={<SuccessIcon />}
        />
      </Box>
    </>
  );
};

export default DesktopLicensingDetailsPage;
