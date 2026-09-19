
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  Chip,
  CssBaseline,
  createTheme,
} from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReceiptIcon from "@mui/icons-material/Receipt";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import Sidebar, {
  drawerWidth,
} from "../components/layout/Sidebar";

import Header from "../components/layout/Header";

interface Transaction {
  _id?: string;
  id?: string;
  date?: string;
  company?: string;
  category?: string;
  amount?: number;
  type?: string;
  status?: string;
  user?: string;
  user_id?: string;
  user_profile?: string;
}

interface Analytics {
  summary: {
    totalIncome?: number;
    totalRevenue?: number;
    totalExpense: number;
    balance: number;
    totalTransactions: number;
  };

  categoryBreakdown: {
    name: string;
    value: number;
  }[];

  monthlyTrend: {
    month: string;
    income?: number;
    revenue?: number;
    expense: number;
  }[];
}

type SnackbarSeverity =
  | "success"
  | "error"
  | "warning"
  | "info";

type SortOrder = "asc" | "desc";

interface AppliedFilters {
  search: string;
  category: string;
  status: string;
  userId: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
}

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f59e0b",
  "#9333ea",
  "#0891b2",
];

const exportColumns = [
  {
    key: "id",
    label: "Transaction ID",
  },
  {
    key: "date",
    label: "Date",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "category",
    label: "Category",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "user_id",
    label: "User ID",
  },
  {
    key: "user_profile",
    label: "User Profile",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [loadingDashboard, setLoadingDashboard] =
    useState(true);

  const [loadingTransactions, setLoadingTransactions] =
    useState(false);

  const [exporting, setExporting] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState<boolean>(() => {
      return (
        localStorage.getItem("darkMode") ===
        "true"
      );
    });

  /*
   * Draft filter values are updated locally and
   * applied to the API only after the user submits
   * the filter form.
   */
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [userId, setUserId] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [minAmount, setMinAmount] =
    useState("");

  const [maxAmount, setMaxAmount] =
    useState("");

  /*
   * Applied filters represent the filter state currently
   * used for transaction API requests and CSV exports.
   */
  const [appliedFilters, setAppliedFilters] =
    useState<AppliedFilters>({
      search: "",
      category: "",
      status: "",
      userId: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });

  const [sortBy, setSortBy] =
    useState("date");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("desc");

  const [categories, setCategories] =
    useState<string[]>([]);

  const [statuses, setStatuses] =
    useState<string[]>([]);

  const [users, setUsers] =
    useState<string[]>([]);

  const [showExportModal, setShowExportModal] =
    useState(false);

  const [selectedColumns, setSelectedColumns] =
    useState<string[]>([
      "id",
      "date",
      "amount",
      "category",
      "status",
    ]);

  const [snackbar, setSnackbar] =
    useState<{
      open: boolean;
      message: string;
      severity: SnackbarSeverity;
    }>({
      open: false,
      message: "",
      severity: "error",
    });

  const user = useMemo(() => {
    try {
      const userData =
        localStorage.getItem("user");

      return userData
        ? JSON.parse(userData)
        : null;
    } catch {
      return null;
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",

          primary: {
            main: "#2563eb",
          },

          success: {
            main: "#16a34a",
          },

          error: {
            main: "#dc2626",
          },

          warning: {
            main: "#f59e0b",
          },

          background: {
            default: darkMode
              ? "#020617"
              : "#f8fafc",

            paper: darkMode
              ? "#0f172a"
              : "#ffffff",
          },

          text: {
            primary: darkMode
              ? "#f8fafc"
              : "#0f172a",

            secondary: darkMode
              ? "#94a3b8"
              : "#64748b",
          },

          divider: darkMode
            ? "#334155"
            : "#e2e8f0",
        },

        shape: {
          borderRadius: 12,
        },

        typography: {
          fontFamily:
            "Inter, Roboto, Helvetica, Arial, sans-serif",
        },

        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                margin: 0,

                backgroundColor: darkMode
                  ? "#020617"
                  : "#f8fafc",

                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                transition:
                  "background-color 0.2s ease, color 0.2s ease",
              },

              "*": {
                scrollbarColor: darkMode
                  ? "#475569 #0f172a"
                  : "#cbd5e1 #f8fafc",
              },

              "*::-webkit-scrollbar": {
                width: 8,
                height: 8,
              },

              "*::-webkit-scrollbar-track": {
                background: darkMode
                  ? "#0f172a"
                  : "#f8fafc",
              },

              "*::-webkit-scrollbar-thumb": {
                background: darkMode
                  ? "#475569"
                  : "#cbd5e1",

                borderRadius: 8,
              },
            },
          },

          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",

                backgroundColor: darkMode
                  ? "#0f172a"
                  : "#ffffff",

                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",
              },
            },
          },

          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode
                  ? "#0f172a"
                  : "#ffffff",

                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                border: `1px solid ${
                  darkMode
                    ? "#1e293b"
                    : "#e2e8f0"
                }`,

                boxShadow: darkMode
                  ? "0 8px 30px rgba(0,0,0,0.25)"
                  : "0 4px 20px rgba(15,23,42,0.06)",

                transition:
                  "background-color 0.2s ease, border-color 0.2s ease",
              },
            },
          },

          MuiTableContainer: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode
                  ? "#0f172a"
                  : "#ffffff",

                borderColor: darkMode
                  ? "#334155"
                  : "#e2e8f0",
              },
            },
          },

          MuiTable: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode
                  ? "#0f172a"
                  : "#ffffff",
              },
            },
          },

          MuiTableCell: {
            styleOverrides: {
              root: {
                color: darkMode
                  ? "#e2e8f0"
                  : "#0f172a",

                borderColor: darkMode
                  ? "#334155"
                  : "#e2e8f0",
              },

              head: {
                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                fontWeight: 700,

                backgroundColor: darkMode
                  ? "#1e293b"
                  : "#f8fafc",
              },
            },
          },

          MuiTableRow: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(51,65,85,0.45)"
                    : "rgba(241,245,249,0.8)",
                },
              },
            },
          },

          MuiTextField: {
            defaultProps: {
              variant: "outlined",
            },
          },

          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                backgroundColor: darkMode
                  ? "#111c30"
                  : "#ffffff",

                "& .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: darkMode
                      ? "#475569"
                      : "#cbd5e1",
                  },

                "&:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: darkMode
                      ? "#64748b"
                      : "#94a3b8",
                  },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "#2563eb",
                  },
              },

              input: {
                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                "&::placeholder": {
                  color: darkMode
                    ? "#64748b"
                    : "#94a3b8",

                  opacity: 1,
                },
              },
            },
          },

          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: darkMode
                  ? "#94a3b8"
                  : "#64748b",

                "&.Mui-focused": {
                  color: "#60a5fa",
                },
              },
            },
          },

          MuiSelect: {
            styleOverrides: {
              select: {
                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                backgroundColor: darkMode
                  ? "#111c30"
                  : "#ffffff",
              },

              icon: {
                color: darkMode
                  ? "#94a3b8"
                  : "#64748b",
              },
            },
          },

          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: darkMode
                  ? "#0f172a"
                  : "#ffffff",

                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                border: `1px solid ${
                  darkMode
                    ? "#334155"
                    : "#e2e8f0"
                }`,
              },
            },
          },

          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                "&:hover": {
                  backgroundColor: darkMode
                    ? "#1e293b"
                    : "#f1f5f9",
                },

                "&.Mui-selected": {
                  backgroundColor: darkMode
                    ? "#1e3a8a"
                    : "#dbeafe",
                },

                "&.Mui-selected:hover": {
                  backgroundColor: darkMode
                    ? "#1e40af"
                    : "#bfdbfe",
                },
              },
            },
          },

          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: darkMode
                  ? "#0f172a"
                  : "#ffffff",

                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                border: `1px solid ${
                  darkMode
                    ? "#334155"
                    : "#e2e8f0"
                }`,
              },
            },
          },

          MuiDialogTitle: {
            styleOverrides: {
              root: {
                color: darkMode
                  ? "#f8fafc"
                  : "#0f172a",
              },
            },
          },

          MuiDialogContent: {
            styleOverrides: {
              root: {
                borderColor: darkMode
                  ? "#334155"
                  : "#e2e8f0",
              },
            },
          },

          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: darkMode
                  ? "#64748b"
                  : "#94a3b8",

                "&.Mui-checked": {
                  color: "#2563eb",
                },
              },
            },
          },

          MuiChip: {
            styleOverrides: {
              root: {
                borderColor: darkMode
                  ? "#475569"
                  : "#cbd5e1",
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
              },
            },
          },

          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backgroundColor: darkMode
                  ? "#f8fafc"
                  : "#0f172a",

                color: darkMode
                  ? "#0f172a"
                  : "#ffffff",

                fontSize: "0.8rem",
              },
            },
          },

          MuiSkeleton: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode
                  ? "rgba(148,163,184,0.12)"
                  : "rgba(100,116,139,0.11)",
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const showSnackbar = (
    message: string,
    severity: SnackbarSeverity = "error"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleThemeToggle = () => {
    setDarkMode((current) => {
      const next = !current;

      localStorage.setItem(
        "darkMode",
        String(next)
      );

      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleClearFilters = () => {
    const emptyFilters: AppliedFilters = {
      search: "",
      category: "",
      status: "",
      userId: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    };

    setSearch("");
    setCategory("");
    setStatus("");
    setUserId("");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");

    setAppliedFilters(emptyFilters);

    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      category,
      status,
      userId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
    });

    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((current) =>
        current === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }

    setCurrentPage(1);
  };

  const sortIndicator = (field: string) => {
    if (sortBy !== field) {
      return "";
    }

    return sortOrder === "asc"
      ? " ↑"
      : " ↓";
  };

  const getStatusColor = (
    value?: string
  ):
    | "success"
    | "warning"
    | "error"
    | "info"
    | "default" => {
    if (!value) {
      return "default";
    }

    const normalized =
      value.toLowerCase();

    if (
      normalized === "paid" ||
      normalized === "completed" ||
      normalized === "success" ||
      normalized === "successful"
    ) {
      return "success";
    }

    if (
      normalized === "pending" ||
      normalized === "processing"
    ) {
      return "warning";
    }

    if (
      normalized === "failed" ||
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return "error";
    }

    return "info";
  };

  const renderSummarySkeleton = () => (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Skeleton
          variant="text"
          width="55%"
        />

        <Skeleton
          variant="text"
          width="70%"
          height={50}
        />
      </CardContent>
    </Card>
  );

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      showSnackbar(
        "Please select at least one column",
        "warning"
      );

      return;
    }

    try {
      setExporting(true);

      const response =
        await api.post(
          "/transactions/export",
          {
            columns: selectedColumns,

            search: appliedFilters.search,
            category:
              appliedFilters.category,
            status: appliedFilters.status,
            user: appliedFilters.userId,
            startDate:
              appliedFilters.startDate,
            endDate:
              appliedFilters.endDate,
            minAmount:
              appliedFilters.minAmount,
            maxAmount:
              appliedFilters.maxAmount,

            sortBy,
            sortOrder,
          },
          {
            responseType: "blob",
          }
        );

      const blob = new Blob(
        [response.data],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "financial-transactions.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setShowExportModal(false);

      showSnackbar(
        "CSV exported successfully",
        "success"
      );
    } catch (error) {
      console.error(
        "Export failed:",
        error
      );

      showSnackbar(
        "Failed to export CSV",
        "error"
      );
    } finally {
      setExporting(false);
    }
  };

  /*
   * Load dashboard analytics and filter options once
   * when the dashboard is initialized.
   */
  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      setLoadingDashboard(true);

      try {
        const [
          analyticsResponse,
          optionsResponse,
        ] = await Promise.all([
          api.get(
            "/transactions/analytics"
          ),

          api.get(
            "/transactions/options"
          ),
        ]);

        if (!mounted) {
          return;
        }

        setAnalytics(
          analyticsResponse.data || null
        );

        setCategories(
          optionsResponse.data
            ?.options?.categories || []
        );

        setStatuses(
          optionsResponse.data
            ?.options?.statuses || []
        );

        setUsers(
          optionsResponse.data
            ?.options?.users || []
        );
      } catch (error: any) {
        console.error(
          "Initial dashboard fetch failed:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;
        }

        showSnackbar(
          error.response?.data?.message ||
            "Failed to load dashboard data",
          "error"
        );
      } finally {
        if (mounted) {
          setLoadingDashboard(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  /*
   * Fetch transactions whenever pagination, applied
   * filters, or sorting state changes.
   */
  useEffect(() => {
    let mounted = true;

    const fetchTransactions = async () => {
      setLoadingTransactions(true);

      try {
        const response =
          await api.get(
            "/transactions",
            {
              params: {
                page: currentPage,
                limit: 10,

                search:
                  appliedFilters.search,

                category:
                  appliedFilters.category,

                status:
                  appliedFilters.status,

                user:
                  appliedFilters.userId,

                startDate:
                  appliedFilters.startDate,

                endDate:
                  appliedFilters.endDate,

                minAmount:
                  appliedFilters.minAmount,

                maxAmount:
                  appliedFilters.maxAmount,

                sortBy,
                sortOrder,
              },
            }
          );

        if (!mounted) {
          return;
        }

        setTransactions(
          response.data?.transactions || []
        );

        setTotalPages(
          response.data?.pagination
            ?.totalPages || 1
        );
      } catch (error: any) {
        console.error(
          "Transactions fetch failed:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;
        }

        showSnackbar(
          error.response?.data?.message ||
            "Failed to load transactions",
          "error"
        );
      } finally {
        if (mounted) {
          setLoadingTransactions(false);
        }
      }
    };

    fetchTransactions();

    return () => {
      mounted = false;
    };
  }, [
    currentPage,
    appliedFilters,
    sortBy,
    sortOrder,
    navigate,
  ]);

  const chartData = useMemo(() => {
    return (
      analytics?.monthlyTrend || []
    ).map((item) => ({
      month: item.month,

      revenue:
        item.revenue ??
        item.income ??
        0,

      expense: item.expense ?? 0,
    }));
  }, [analytics]);

  const totalRevenue =
    analytics?.summary.totalRevenue ??
    analytics?.summary.totalIncome ??
    0;

  const totalExpense =
    analytics?.summary.totalExpense ?? 0;

  const balance =
    analytics?.summary.balance ?? 0;

  const totalTransactions =
    analytics?.summary.totalTransactions ??
    0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",

          transition:
            "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() =>
            setMobileOpen(false)
          }
          darkMode={darkMode}
        />

        <Header
          onMenuClick={() =>
            setMobileOpen(true)
          }
          darkMode={darkMode}
          onThemeToggle={
            handleThemeToggle
          }
          onLogout={handleLogout}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            minHeight: "100vh",

            bgcolor:
              "background.default",

            pt: "72px",

            ml: {
              xs: 0,
              md: `${drawerWidth}px`,
            },

            width: {
              xs: "100%",
              md: `calc(100% - ${drawerWidth}px)`,
            },

            transition:
              "background-color 0.2s ease",
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              width: "100%",
              maxWidth: "1600px",
              mx: "auto",

              px: {
                xs: 2,
                sm: 3,
                lg: 4,
                xl: 5,
              },

              py: {
                xs: 2,
                sm: 3,
                md: 4,
              },

              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                mb: 3,

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },

                flexDirection: {
                  xs: "column",
                  sm: "row",
                },

                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    fontSize: {
                      xs: "1.7rem",
                      sm: "2rem",
                      md: "2.2rem",
                    },

                    letterSpacing:
                      "-0.5px",
                  }}
                >
                  Dashboard
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Welcome back,{" "}
                  {user?.name || "User"}.
                  Here's your financial
                  overview.
                </Typography>
              </Box>
            </Box>

            {loadingDashboard ? (
              <>
                <Grid
                  container
                  spacing={2.5}
                  sx={{ mb: 3 }}
                >
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <Grid
                        key={item}
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 3,
                        }}
                      >
                        {renderSummarySkeleton()}
                      </Grid>
                    )
                  )}
                </Grid>

                <Card
                  sx={{
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        minHeight: 350,

                        display: "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        flexDirection:
                          "column",

                        gap: 2,
                      }}
                    >
                      <CircularProgress />

                      <Typography color="text.secondary">
                        Loading dashboard...
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Grid
                  container
                  spacing={2.5}
                  sx={{ mb: 3 }}
                >
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      lg: 3,
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems:
                              "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight={500}
                            >
                              Total Transactions
                            </Typography>

                            <Typography
                              variant="h4"
                              fontWeight={800}
                              sx={{
                                mt: 1,
                              }}
                            >
                              {
                                totalTransactions
                              }
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: 2,

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              bgcolor:
                                darkMode
                                  ? "#172554"
                                  : "#eff6ff",

                              color:
                                "#2563eb",
                            }}
                          >
                            <ReceiptIcon />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      lg: 3,
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems:
                              "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight={500}
                            >
                              Total Revenue
                            </Typography>

                            <Typography
                              variant="h4"
                              color="success.main"
                              fontWeight={800}
                              sx={{
                                mt: 1,
                              }}
                            >
                              ₹
                              {totalRevenue.toLocaleString(
                                "en-IN"
                              )}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: 2,

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              bgcolor:
                                darkMode
                                  ? "#052e16"
                                  : "#f0fdf4",

                              color:
                                "#16a34a",
                            }}
                          >
                            <TrendingUpIcon />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      lg: 3,
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems:
                              "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight={500}
                            >
                              Total Expense
                            </Typography>

                            <Typography
                              variant="h4"
                              color="error.main"
                              fontWeight={800}
                              sx={{
                                mt: 1,
                              }}
                            >
                              ₹
                              {totalExpense.toLocaleString(
                                "en-IN"
                              )}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: 2,

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              bgcolor:
                                darkMode
                                  ? "#450a0a"
                                  : "#fef2f2",

                              color:
                                "#dc2626",
                            }}
                          >
                            <TrendingDownIcon />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      lg: 3,
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems:
                              "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight={500}
                            >
                              Balance
                            </Typography>

                            <Typography
                              variant="h4"
                              fontWeight={800}
                              sx={{
                                mt: 1,

                                color:
                                  balance >=
                                  0
                                    ? "primary.main"
                                    : "error.main",
                              }}
                            >
                              ₹
                              {balance.toLocaleString(
                                "en-IN"
                              )}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: 2,

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              bgcolor:
                                darkMode
                                  ? "#172554"
                                  : "#eff6ff",

                              color:
                                "#2563eb",
                            }}
                          >
                            <AccountBalanceWalletIcon />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2.5}
                  sx={{ mb: 3 }}
                >
                  <Grid
                    size={{
                      xs: 12,
                      lg: 6,
                    }}
                  >
                    <Card
                      sx={{
                        height: {
                          xs: 420,
                          md: 460,
                        },

                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <CardContent
                        sx={{
                          height: "100%",

                          display: "flex",

                          flexDirection:
                            "column",

                          "&:last-child": {
                            pb: 2,
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={700}
                        >
                          Revenue vs Expenses
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Monthly financial
                          performance
                        </Typography>

                        <Box
                          sx={{
                            flex: 1,
                            minHeight: 0,
                            width: "100%",
                          }}
                        >
                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >
                            <LineChart
                              data={
                                chartData
                              }
                              margin={{
                                top: 20,
                                right: 20,
                                left: 0,
                                bottom: 10,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={
                                  darkMode
                                    ? "#334155"
                                    : "#e2e8f0"
                                }
                              />

                              <XAxis
                                dataKey="month"
                                tick={{
                                  fill: darkMode
                                    ? "#94a3b8"
                                    : "#64748b",

                                  fontSize: 12,
                                }}
                                axisLine={{
                                  stroke:
                                    darkMode
                                      ? "#475569"
                                      : "#cbd5e1",
                                }}
                                tickLine={{
                                  stroke:
                                    darkMode
                                      ? "#475569"
                                      : "#cbd5e1",
                                }}
                              />

                              <YAxis
                                tick={{
                                  fill: darkMode
                                    ? "#94a3b8"
                                    : "#64748b",

                                  fontSize: 12,
                                }}
                                axisLine={{
                                  stroke:
                                    darkMode
                                      ? "#475569"
                                      : "#cbd5e1",
                                }}
                                tickLine={{
                                  stroke:
                                    darkMode
                                      ? "#475569"
                                      : "#cbd5e1",
                                }}
                              />

                              <Tooltip
                                contentStyle={{
                                  backgroundColor:
                                    darkMode
                                      ? "#0f172a"
                                      : "#ffffff",

                                  border: `1px solid ${
                                    darkMode
                                      ? "#334155"
                                      : "#e2e8f0"
                                  }`,

                                  borderRadius: 8,

                                  color:
                                    darkMode
                                      ? "#f8fafc"
                                      : "#0f172a",
                                }}
                              />

                              <Legend />

                              <Line
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue"
                                stroke="#16a34a"
                                strokeWidth={3}
                                dot={{
                                  r: 4,
                                }}
                                activeDot={{
                                  r: 6,
                                }}
                              />

                              <Line
                                type="monotone"
                                dataKey="expense"
                                name="Expenses"
                                stroke="#dc2626"
                                strokeWidth={3}
                                dot={{
                                  r: 4,
                                }}
                                activeDot={{
                                  r: 6,
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      lg: 6,
                    }}
                  >
                    <Card
                      sx={{
                        height: {
                          xs: 420,
                          md: 460,
                        },

                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <CardContent
                        sx={{
                          height: "100%",

                          display: "flex",

                          flexDirection:
                            "column",

                          "&:last-child": {
                            pb: 2,
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={700}
                        >
                          Category Breakdown
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Transaction
                          distribution
                        </Typography>

                        <Box
                          sx={{
                            flex: 1,
                            minHeight: 0,
                            width: "100%",

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",
                          }}
                        >
                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >
                            <PieChart>
                              <Pie
                                data={
                                  analytics?.categoryBreakdown ||
                                  []
                                }
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                outerRadius="65%"
                                innerRadius="35%"
                                paddingAngle={2}
                                label
                              >
                                {(
                                  analytics?.categoryBreakdown ||
                                  []
                                ).map(
                                  (
                                    _,
                                    index
                                  ) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        CHART_COLORS[
                                          index %
                                            CHART_COLORS.length
                                        ]
                                      }
                                    />
                                  )
                                )}
                              </Pie>

                              <Tooltip
                                contentStyle={{
                                  backgroundColor:
                                    darkMode
                                      ? "#0f172a"
                                      : "#ffffff",

                                  border: `1px solid ${
                                    darkMode
                                      ? "#334155"
                                      : "#e2e8f0"
                                  }`,

                                  borderRadius: 8,
                                }}
                              />

                              <Legend
                                verticalAlign="bottom"
                                height={36}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Card
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },

                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },

                        gap: 2,

                        mb: 2.5,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                        >
                          Transaction Filters
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Search, filter and
                          sort transactions
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap: 1.5,

                          width: {
                            xs: "100%",
                            sm: "auto",
                          },

                          flexDirection: {
                            xs: "column",
                            sm: "row",
                          },
                        }}
                      >
                        <TextField
                          size="small"
                          placeholder="Search transactions..."
                          value={search}
                          onChange={(e) => {
                            setSearch(
                              e.target.value
                            );
                          }}
                          sx={{
                            width: {
                              xs: "100%",
                              sm: 260,
                            },
                          }}
                        />

                        <Button
                          variant="outlined"
                          onClick={
                            handleClearFilters
                          }
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "auto",
                            },
                          }}
                        >
                          Clear Filters
                        </Button>
                      </Box>
                    </Box>

                    <Grid
                      container
                      spacing={2}
                    >
                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          Category
                        </Typography>

                        <FormControl fullWidth>
                          <Select
                            size="small"
                            value={category}
                            displayEmpty
                            onChange={(e) => {
                              setCategory(
                                e.target.value
                              );
                            }}
                          >
                            <MenuItem value="">
                              All Categories
                            </MenuItem>

                            {categories.map(
                              (item) => (
                                <MenuItem
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          Status
                        </Typography>

                        <FormControl fullWidth>
                          <Select
                            size="small"
                            value={status}
                            displayEmpty
                            onChange={(e) => {
                              setStatus(
                                e.target.value
                              );
                            }}
                          >
                            <MenuItem value="">
                              All Status
                            </MenuItem>

                            {statuses.map(
                              (item) => (
                                <MenuItem
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          User
                        </Typography>

                        <FormControl fullWidth>
                          <Select
                            size="small"
                            value={userId}
                            displayEmpty
                            onChange={(e) => {
                              setUserId(
                                e.target.value
                              );
                            }}
                          >
                            <MenuItem value="">
                              All Users
                            </MenuItem>

                            {users.map(
                              (item) => (
                                <MenuItem
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          From Date
                        </Typography>

                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(
                              e.target.value
                            );
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          To Date
                        </Typography>

                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(
                              e.target.value
                            );
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          Min Amount
                        </Typography>

                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder="0.00"
                          value={minAmount}
                          onChange={(e) => {
                            setMinAmount(
                              e.target.value
                            );
                          }}
                        />
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                          lg: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          Max Amount
                        </Typography>

                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder="0.00"
                          value={maxAmount}
                          onChange={(e) => {
                            setMaxAmount(
                              e.target.value
                            );
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          "flex-end",

                        mt: 3,

                        pt: 2,

                        borderTop:
                          "1px solid",

                        borderColor:
                          "divider",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={
                          handleApplyFilters
                        }
                      >
                        Apply Filters
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },

                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },

                        gap: 2,

                        mb: 2.5,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                        >
                          Transactions
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          View and manage
                          financial
                          transactions
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        onClick={() =>
                          setShowExportModal(
                            true
                          )
                        }
                      >
                        Export CSV
                      </Button>
                    </Box>

                    {loadingTransactions ? (
                      <Box
                        sx={{
                          minHeight: 300,

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          flexDirection:
                            "column",

                          gap: 2,
                        }}
                      >
                        <CircularProgress />

                        <Typography
                          color="text.secondary"
                        >
                          Loading transactions...
                        </Typography>
                      </Box>
                    ) : transactions.length ===
                      0 ? (
                      <Box
                        sx={{
                          py: 8,
                          textAlign:
                            "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                        >
                          No transactions
                          found
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                          }}
                        >
                          Try changing or
                          clearing your
                          filters.
                        </Typography>

                        <Button
                          sx={{
                            mt: 2,
                          }}
                          variant="outlined"
                          onClick={
                            handleClearFilters
                          }
                        >
                          Clear Filters
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <TableContainer
                          sx={{
                            overflowX:
                              "auto",

                            border:
                              "1px solid",

                            borderColor:
                              "divider",

                            borderRadius: 2,
                          }}
                        >
                          <Table
                            sx={{
                              minWidth: 850,
                            }}
                          >
                            <TableHead>
                              <TableRow>
                                {[
                                  [
                                    "ID",
                                    "id",
                                  ],
                                  [
                                    "Date",
                                    "date",
                                  ],
                                  [
                                    "Amount",
                                    "amount",
                                  ],
                                  [
                                    "Category",
                                    "category",
                                  ],
                                  [
                                    "Status",
                                    "status",
                                  ],
                                ].map(
                                  ([
                                    label,
                                    field,
                                  ]) => (
                                    <TableCell
                                      key={
                                        field
                                      }
                                      onClick={() =>
                                        handleSort(
                                          field
                                        )
                                      }
                                      sx={{
                                        cursor:
                                          "pointer",

                                        whiteSpace:
                                          "nowrap",
                                      }}
                                    >
                                      {label}

                                      {sortIndicator(
                                        field
                                      )}
                                    </TableCell>
                                  )
                                )}

                                <TableCell>
                                  User
                                </TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {transactions.map(
                                (
                                  transaction
                                ) => {
                                  const transactionId =
                                    transaction.id ??
                                    transaction._id ??
                                    "";

                                  const transactionUser =
                                    transaction.user_id ??
                                    transaction.user ??
                                    "-";

                                  return (
                                    <TableRow
                                      key={
                                        transactionId
                                      }
                                      hover
                                    >
                                      <TableCell>
                                        <Typography
                                          variant="body2"
                                          fontWeight={
                                            600
                                          }
                                        >
                                          #
                                          {
                                            transactionId
                                          }
                                        </Typography>
                                      </TableCell>

                                      <TableCell>
                                        {transaction.date
                                          ? new Date(
                                              transaction.date
                                            ).toLocaleDateString(
                                              "en-IN"
                                            )
                                          : "-"}
                                      </TableCell>

                                      <TableCell
                                        sx={{
                                          fontWeight:
                                            700,
                                        }}
                                      >
                                        ₹
                                        {(
                                          transaction.amount ??
                                          0
                                        ).toLocaleString(
                                          "en-IN"
                                        )}
                                      </TableCell>

                                      <TableCell>
                                        {transaction.category ? (
                                          <Chip
                                            label={
                                              transaction.category
                                            }
                                            size="small"
                                            variant="outlined"
                                          />
                                        ) : (
                                          "-"
                                        )}
                                      </TableCell>

                                      <TableCell>
                                        {transaction.status ? (
                                          <Chip
                                            label={
                                              transaction.status
                                            }
                                            size="small"
                                            color={getStatusColor(
                                              transaction.status
                                            )}
                                          />
                                        ) : (
                                          "-"
                                        )}
                                      </TableCell>

                                      <TableCell>
                                        <Box
                                          sx={{
                                            display:
                                              "flex",

                                            alignItems:
                                              "center",

                                            gap: 1,

                                            minWidth:
                                              150,
                                          }}
                                        >
                                          <Avatar
                                            src={
                                              transaction.user_profile ||
                                              undefined
                                            }
                                            alt={
                                              transactionUser
                                            }
                                            sx={{
                                              width: 32,
                                              height: 32,
                                            }}
                                          >
                                            {transactionUser
                                              .charAt(
                                                0
                                              )
                                              .toUpperCase()}
                                          </Avatar>

                                          <Typography
                                            variant="body2"
                                            noWrap
                                          >
                                            {
                                              transactionUser
                                            }
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <Box
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "center",

                            alignItems:
                              "center",

                            gap: 2,

                            mt: 3,

                            flexWrap:
                              "wrap",
                          }}
                        >
                          <Button
                            variant="outlined"
                            disabled={
                              currentPage ===
                              1 ||
                              loadingTransactions
                            }
                            onClick={() =>
                              setCurrentPage(
                                (page) =>
                                  page - 1
                              )
                            }
                          >
                            Previous
                          </Button>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Page{" "}
                            <strong>
                              {currentPage}
                            </strong>{" "}
                            of{" "}
                            <strong>
                              {totalPages}
                            </strong>
                          </Typography>

                          <Button
                            variant="outlined"
                            disabled={
                              currentPage ===
                                totalPages ||
                              loadingTransactions
                            }
                            onClick={() =>
                              setCurrentPage(
                                (page) =>
                                  page + 1
                              )
                            }
                          >
                            Next
                          </Button>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </Container>
        </Box>

        <Dialog
          open={showExportModal}
          onClose={() => {
            if (!exporting) {
              setShowExportModal(
                false
              );
            }
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Export Transactions
          </DialogTitle>

          <DialogContent dividers>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Select the columns you want
              to include in your CSV file.
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },

                gap: 0.5,
              }}
            >
              {exportColumns.map(
                (column) => (
                  <FormControlLabel
                    key={column.key}
                    control={
                      <Checkbox
                        checked={selectedColumns.includes(
                          column.key
                        )}
                        onChange={(e) => {
                          if (
                            e.target.checked
                          ) {
                            setSelectedColumns(
                              (current) =>
                                current.includes(
                                  column.key
                                )
                                  ? current
                                  : [
                                      ...current,
                                      column.key,
                                    ]
                            );
                          } else {
                            setSelectedColumns(
                              (current) =>
                                current.filter(
                                  (
                                    item
                                  ) =>
                                    item !==
                                    column.key
                                )
                            );
                          }
                        }}
                      />
                    }
                    label={column.label}
                  />
                )
              )}
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
              }}
            >
              {selectedColumns.length}{" "}
              columns selected
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() =>
                setShowExportModal(
                  false
                )
              }
              disabled={exporting}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleExport}
              disabled={
                selectedColumns.length ===
                  0 || exporting
              }
            >
              {exporting ? (
                <>
                  <CircularProgress
                    size={18}
                    color="inherit"
                    sx={{
                      mr: 1,
                    }}
                  />

                  Exporting...
                </>
              ) : (
                "Export CSV"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() =>
            setSnackbar(
              (current) => ({
                ...current,
                open: false,
              })
            )
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={() =>
              setSnackbar(
                (current) => ({
                  ...current,
                  open: false,
                })
              )
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;

