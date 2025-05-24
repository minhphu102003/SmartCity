"use client"
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  InputAdornment,
  Typography,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion } from "framer-motion"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import TuneIcon from "@mui/icons-material/Tune"


const StyledPaper = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(
    theme.palette.background.paper,
    0.95,
  )})`,
  backdropFilter: "blur(8px)",
  marginBottom: theme.spacing(4),
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}))

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
}))

const REPORT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'TRAFFIC_JAM', label: 'Traffic Jam' },
  { value: 'ACCIDENT', label: 'Accident' },
  { value: 'FLOOD', label: 'Flood' }
];

const ReportHeader = ({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus }) => {
  const theme = useTheme()

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <StyledPaper initial="hidden" animate="visible" variants={containerVariants}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TuneIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Report Filters
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", md: "auto" },
            flex: { md: 1 },
          }}
        >
          <motion.div variants={itemVariants} style={{ width: "30%", maxWidth: { sm: "200px" } }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="status-select-label">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Report Type
                </Box>
              </InputLabel>
              <StyledSelect
                labelId="status-select-label"
                value={selectedStatus}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Report Type
                  </Box>
                }
                onChange={(e) => setSelectedStatus(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    },
                  },
                }}
              >
                {REPORT_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </motion.div>
        </Box>
      </Box>
    </StyledPaper>
  )
}

export default ReportHeader
