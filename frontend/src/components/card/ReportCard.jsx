"use client"
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material"
import { format, formatDistanceToNow } from "date-fns"
import { styled } from "@mui/material/styles"
import { motion } from "framer-motion"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import ShareIcon from "@mui/icons-material/Share"
import { Flag } from 'lucide-react'
import { enUS } from 'date-fns/locale';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';


const StyledCard = styled(motion(Card))(({ theme }) => ({
  width: "100%",
  maxWidth: "2xl",
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  overflow: "visible",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
  },
}))

const StatusChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: theme.spacing(1),
  fontWeight: 600,
  "& .MuiChip-icon": {
    fontSize: 16,
  },
  ...(color === "warning" && {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.dark,
    borderColor: theme.palette.warning.light,
  }),
  ...(color === "error" && {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.light,
  }),
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  position: "relative",
}))

const StyledCardMedia = styled(motion(CardMedia))(({ theme }) => ({
  height: 180,
  borderRadius: theme.spacing(1),
  objectFit: "cover",
}))

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.secondary,
  "& svg": {
    fontSize: 16,
    marginRight: theme.spacing(0.5),
  },
}))

const getStatusColor = (typeReport) => {
  switch (typeReport) {
    case 'TRAFFIC_JAM':
      return 'warning';
    case 'ACCIDENT':
      return 'error';
    case 'FLOOD':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusLabel = (typeReport) => {
  switch (typeReport) {
    case 'TRAFFIC_JAM':
      return 'Traffic Jam';
    case 'ACCIDENT':
      return 'Accident';
    case 'FLOOD':
      return 'Flood';
    default:
      return typeReport;
  }
};

const getCongestionLabel = (level) => {
  switch (level) {
    case 'POSSIBLE_CONGESTION':
      return 'Possible Congestion';
    case 'MODERATE_CONGESTION':
      return 'Moderate Congestion';
    case 'SEVERE_CONGESTION':
      return 'Severe Congestion';
    default:
      return level?.replace(/_/g, ' ') || 'Unknown';
  }
};

const ReportCard = ({ report, onReport }) => {
  const { user, content, images, status, createdAt, location, congestionLevel } = report
  const theme = useTheme();

  const [lat, lng] = location.split(',').map(Number);

  const { address, loading } = useReverseGeocode(lat, lng);

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: enUS,
  })

  const formattedDate = format(new Date(createdAt), 'PPpp', { locale: enUS })

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  return (
    <StyledCard initial="hidden" animate="visible" variants={cardVariants}>
      <CardContent sx={{ p: 3 }}>

        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{
                  width: 50,
                  height: 50,
                  mr: 2,
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            </motion.div>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user.name}
                {user.roles?.includes('admin') && (
                  <Chip
                    size="small"
                    label="Admin"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1, height: 20 }}
                  />
                )}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip title={formattedDate}>
                  <InfoItem>
                    <AccessTimeIcon />
                    <Typography variant="caption">{timeAgo}</Typography>
                  </InfoItem>
                </Tooltip>
              </Box>
            </Box>
          </Box>
          <StatusChip
            icon={<WarningAmberIcon />}
            label={getStatusLabel(status)}
            color={getStatusColor(status)}
            variant="outlined"
            size="medium"
          />
        </Box>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            fontSize: "1rem",
            color: theme.palette.text.primary,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
            p: 2,
            borderRadius: 1,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
          }}
        >
          {content}
          {congestionLevel && (
            <Chip
              size="small"
              label={getCongestionLabel(congestionLevel)}
              color="warning"
              sx={{ ml: 1, height: 20 }}
            />
          )}
        </Typography>

        {images && images.length > 0 && (
          <ImageContainer>
            {images.map((image, index) => (
              <Box key={index} sx={{ position: "relative", overflow: "hidden", borderRadius: 1 }}>
                <StyledCardMedia
                  component="img"
                  image={image}
                  alt={`Report image ${index + 1}`}
                  whileHover="hover"
                  variants={imageVariants}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title="View full size">
                    <IconButton
                      size="small"
                      sx={{ color: "white" }}
                      onClick={() => window.open(image, '_blank')}
                    >
                      <FullscreenIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </ImageContainer>
        )}

        <Divider sx={{ my: 2 }} />

        <Box className="flex justify-between items-center">
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="View on map">
              <InfoItem>
                <LocationOnIcon />
                <Typography variant="body2">
                  {loading ? 'Loading address...' : address}
                </Typography>
              </InfoItem>
            </Tooltip>
            <Tooltip title="Share report">
              <IconButton size="small" color="primary">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<Flag className="w-5 h-5" />}
              sx={{
                borderRadius: 6,
                px: 2,
                boxShadow: "0 4px 10px rgba(211, 47, 47, 0.25)",
                "&:hover": {
                  boxShadow: "0 6px 15px rgba(211, 47, 47, 0.35)",
                },
              }}
              onClick={() => onReport(report)}
            >
              Report
            </Button>
          </motion.div> */}
        </Box>
      </CardContent>
    </StyledCard>
  )
}

export default ReportCard
