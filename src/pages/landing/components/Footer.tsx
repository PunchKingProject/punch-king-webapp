import { Box, Link, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { consortiumLogo, punchKingLogoFooter } from '../../../assets';
import ROUTES from '../../../routes/routePath.ts';
import { colors } from '../../../theme/colors.ts';

// SVGs (via Vite SVGR)
import EmailIcon from '../../../assets/emailLogo.svg?react';
import InstagramIcon from '../../../assets/instagramLogo.svg?react';
import FacebookIcon from '../../../assets/facebookLogo.svg?react';
import PhoneIcon from '../../../assets/phoneLogo.svg?react';
import WhatsAppIcon from '../../../assets/whatsappLogo.svg?react';
import YouTubeIcon from '../../../assets/youtubeLogo.svg?react';

const CONTACT_PRIMARY = '+234 9061287852'; // WhatsApp + Tel
const CONTACT_EMAIL = 'Punchkingboxinglimited@gmail.com';

// Social profiles (from your screenshot)
const INSTAGRAM_URL = 'https://instagram.com/punchkingboxing';
const YOUTUBE_URL = 'https://www.youtube.com/@Punchkingboxinglimited';
// If this exact page slug differs, swap it out; name is “Punch King Boxing Limited.”
const FACEBOOK_URL = 'https://www.facebook.com/PunchKingBoxingLimited';

// Small helper to render icon + text with optional link
function ContactLine({
  icon: Icon,
  children,
  href,
  label,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  href?: string;
  label?: string;
}) {
  const content = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        color: colors.Freeze,
        fontSize: 14,
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.Accent,
          '& svg': { width: 18, height: 18, display: 'block' },
        }}
        aria-hidden
      >
        <Icon />
      </Box>
      <span>{children}</span>
    </Box>
  );

  if (href) {
    const external = href.startsWith('http');
    return (
      <Link
        href={href}
        aria-label={label}
        underline='none'
        color='inherit'
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        sx={{ '&:hover': { opacity: 0.85 } }}
      >
        {content}
      </Link>
    );
  }
  return content;
}

const Footer = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/' || pathname === ROUTES.HOME;

  return (
    <Box
      id='contacts'
      component='footer'
      sx={{
        width: '100%',
        bgcolor: colors.Card,
        borderTop: '1px solid #3B3B3B',
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          // 1 column on mobile: center → contact → socials (socials at bottom)
          gridTemplateColumns: {
            xs: '1fr',
            md: isHome ? '1fr 1fr 1fr' : '1fr 1fr',
          },
          gridTemplateAreas: {
            xs: `"center"
           "contact"
           "socials"`,
            // Desktop: keep previous layout for home (socials left, logo center, contact right)
            md: isHome
              ? `"socials center contact"`
              : // Non-home desktop/tablet: keep two cols; socials can sit below (no design change requested)
                `"center contact"
           "socials socials"`,
          },
          alignItems: 'center',
          justifyItems: 'center',
          rowGap: 2,
        }}
      >
        {/* Socials */}
        <Box
          sx={{
            display: 'flex',
            gap: 2.5,
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-end' },
            mt: { xs: 1, md: 0 },
            '& a svg': { width: 40, height: 40 },
          }}
          aria-label='Social links'
        >
          <Link
            href={INSTAGRAM_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Instagram'
            underline='none'
          >
            <InstagramIcon />
          </Link>
          <Link
            href={YOUTUBE_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='YouTube'
            underline='none'
          >
            <YouTubeIcon />
          </Link>
          <Link
            href={FACEBOOK_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Facebook'
            underline='none'
          >
            <FacebookIcon />
          </Link>
        </Box>

        {/* Center block */}
        <Box
          textAlign='center'
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            background: colors.Card,
          }}
        >
          <Box
            component='img'
            src={punchKingLogoFooter}
            alt='Punch King'
            sx={{ width: '10.125rem', objectFit: 'cover', display: 'block' }}
          />
          <Typography sx={{ color: colors.Freeze }}>
            License No: NBBofC/24/030
          </Typography>

          {isHome && (
            <>
              <Typography sx={{ color: colors.TextGrey }}>
                Technology partners: consortium
              </Typography>
              <Box
                component='img'
                src={consortiumLogo}
                alt='Technology partner consortium'
                sx={{ width: '1.75rem', objectFit: 'cover', display: 'block' }}
              />
            </>
          )}
        </Box>

        {/* Contact / “Contact us” */}
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            justifyItems: { xs: 'center', md: 'start' },
            textAlign: { xs: 'center', md: 'left' },
            fontWeight: 700,
          }}
        >
          {/* WhatsApp */}
          <ContactLine
            icon={WhatsAppIcon}
            href={`https://wa.me/${CONTACT_PRIMARY.replace(/\D/g, '')}`}
            label='Contact via WhatsApp'
          >
            {CONTACT_PRIMARY}
          </ContactLine>

          {/* Email */}
          <ContactLine
            icon={EmailIcon}
            href={`mailto:${CONTACT_EMAIL}`}
            label='Contact via email'
          >
            {CONTACT_EMAIL}
          </ContactLine>

          {/* Tel */}
          <ContactLine
            icon={PhoneIcon}
            href={`tel:${CONTACT_PRIMARY.replace(/\s/g, '')}`}
            label='Call us'
          >
            {CONTACT_PRIMARY}
          </ContactLine>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
