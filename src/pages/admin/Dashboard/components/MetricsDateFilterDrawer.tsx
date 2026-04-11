import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { DateRange } from 'react-day-picker';
import DateFilterIcon from '../../../../assets/filterTimeFrameIcon.svg?react'
import { colors } from '../../../../theme/colors';
import DateRangeFilter from '../../../../components/filters/DateRangeFilter';

type Props = {
  range: DateRange | undefined;
  onApply: (next: DateRange) => void;
  title?: string; // optional custom title
};

export default function MetricsDateFilterDrawer({
  range,
  onApply,
  title = 'Filter dashboard metrics',
}: Props) {
  const {
    t: t
  } = useTranslation();

  const [open, setOpen] = useState(false);
  const [staged, setStaged] = useState<DateRange | undefined>(range);

  useEffect(() => setStaged(range), [range]);

  return (
    <>
      <IconButton
        aria-label='Filter metrics by date'
        onClick={() => setOpen(true)}
        sx={{ color: colors.Freeze }}
      >
        <DateFilterIcon />
      </IconButton>
      <Drawer
        anchor='bottom'
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            background: colors.Card,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography
              variant='mediumHeaderBold'
              sx={{ color: colors.Freeze }}
            >
              {title}
            </Typography>
            <CalendarTodayIcon sx={{ color: colors.Freeze, opacity: 0.8 }} />
          </Box>

          <DateRangeFilter
            range={staged}
            onChange={(r?: DateRange) => setStaged(r)}
            icon={<DateFilterIcon />}
          />

          <Button
            fullWidth
            variant='contained'
            sx={{ mt: 2 }}
            onClick={() => {
              if (staged?.from && staged.to) onApply(staged);
              setOpen(false);
            }}
          >{t("apply")}</Button>
        </Box>
      </Drawer>
    </>
  );
}
