import 'react-day-picker/dist/style.css';
import { Box, Popover, Typography } from '@mui/material';
import { DayPicker, type DateRange } from 'react-day-picker';
import { useRef, useState, type ReactNode } from 'react';
import DateFilterIcon from '../../assets/filterTimeFrameIcon.svg?react';
type Props = {
  label?: string;
  icon?: ReactNode;
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
};

function DateRangeFilter({
  label = 'FIlter by time frame',
  icon = <DateFilterIcon />,
  range,
  onChange,
}: Props) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const openPopover = () => setOpen(true);
  const closePopover = () => setOpen(false);

  // small readable label: Aug 11, 2025 — Today
  const fmt = (d?: Date) =>
    d
      ? d.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '-';

  const currentLabel =
    range?.from && range?.to
      ? `${fmt(range.from)} - ${fmt(range.to)}`
      : range?.from
      ? `${fmt(range.from)} — …`
      : label;

  return (
    <>
      {/* Clickable label + icon */}
      <Box
        ref={buttonRef}
        onClick={openPopover}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          userSelect: 'none',
        }}
      >
        <Typography color='primary'>{currentLabel}</Typography>
        {icon}
      </Box>

      <Popover
        open={open}
        onClose={closePopover}
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              p: 1,
            },
          },
        }}
      >
        <DayPicker
          mode='range'
          selected={range}
          onSelect={(r) => {
            onChange(r);
            // Close when a full range is picked
            if (r?.from && r?.to) closePopover();
          }}
          defaultMonth={range?.from}
          captionLayout='dropdown'
          numberOfMonths={1} // keeps it compact; change to 2 on xl if you want
        />
      </Popover>
    </>
  );
}

export default DateRangeFilter;
