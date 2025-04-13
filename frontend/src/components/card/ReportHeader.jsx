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

  return (
    <StyledPaper initial="hidden" animate="visible" variants={containerVariants}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TuneIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Bộ lọc báo cáo
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
              label="Tìm kiếm báo cáo"
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
              placeholder="Nhập từ khóa..."
            />
          </motion.div>

          <motion.div variants={itemVariants} style={{ width: "100%", maxWidth: { sm: "200px" } }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="status-select-label">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Tình trạng
                </Box>
              </InputLabel>
              <StyledSelect
                labelId="status-select-label"
                value={selectedStatus}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Tình trạng
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
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value="Kẹt xe">Kẹt xe</MenuItem>
                <MenuItem value="Lũ lụt">Lũ lụt</MenuItem>
                <MenuItem value="Tai nạn">Tai nạn</MenuItem>
              </StyledSelect>
            </FormControl>
          </motion.div>
        </Box>

        <motion.div variants={itemVariants}>
          <Tooltip title="Tạo báo cáo sự cố mới">
            <StyledButton
              variant="contained"
              color="primary"
              onClick={onCreateReport}
              startIcon={<AddCircleOutlineIcon />}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Tạo báo cáo mới
            </StyledButton>
          </Tooltip>
        </motion.div>
      </Box>
    </StyledPaper>
  )
}

export default ReportHeader
