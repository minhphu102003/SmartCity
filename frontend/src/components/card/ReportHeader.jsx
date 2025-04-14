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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
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

const StyledButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1, 3),
  boxShadow: "0 4px 10px rgba(63, 81, 181, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 15px rgba(63, 81, 181, 0.3)",
  },
}))

const REPORT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'TRAFFIC_JAM', label: 'Traffic Jam' },
  { value: 'ACCIDENT', label: 'Accident' },
  { value: 'FLOOD', label: 'Flood' }
];

const ReportHeader = ({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, onCreateReport }) => {
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

  const handleCreateClick = () => {
    // You can add form validation or data preparation here
    onCreateReport({
      description: '',
      typeReport: 'TRAFFIC_JAM',
      congestionLevel: 'POSSIBLE_CONGESTION',
      longitude: 108.206012143132, // Default longitude for Da Nang
      latitude: 16.0754966720008,  // Default latitude for Da Nang
      images: []
    });
  };

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
          <motion.div variants={itemVariants} style={{ width: "100%" }}>
            <StyledTextField
              label="Search Reports"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by description or location..."
            />
          </motion.div>

          <motion.div variants={itemVariants} style={{ width: "100%", maxWidth: { sm: "200px" } }}>
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

        <motion.div variants={itemVariants}>
          <Tooltip title="Create new incident report">
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleCreateClick}
              startIcon={<AddCircleOutlineIcon />}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Create Report
            </StyledButton>
          </Tooltip>
        </motion.div>
      </Box>
    </StyledPaper>
  )
}

export default ReportHeader
