import { Request, Response } from "express";
import Transaction from "../models/Transaction";
import { Parser } from "json2csv";


export const getTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      search,
      category,
      status,
      user,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "date",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    // --------------------------------
    // 1. Build MongoDB filter
    // --------------------------------

    const filter: any = {};

    // Search
    if (search) {
  const searchRegex = new RegExp(
    search as string,
    "i"
  );

  filter.$or = [
    {
      category: searchRegex,
    },
    {
      status: searchRegex,
    },
    {
      user_id: searchRegex,
    },
  ];

  if (!isNaN(Number(search))) {
    filter.$or.push({
      id: Number(search),
    });
  }
}

    // Category
    if (category) {
      filter.category = category;
    }

    // Status
    if (status) {
      filter.status = status;
    }

    // User
    if (user) {
      filter.user_id = user;
    }

    // --------------------------------
    // 2. Amount filter
    // --------------------------------

    if (minAmount || maxAmount) {
      filter.amount = {};

      if (minAmount) {
        filter.amount.$gte = Number(minAmount);
      }

      if (maxAmount) {
        filter.amount.$lte = Number(maxAmount);
      }
    }

    // --------------------------------
    // 3. Date filter
    // --------------------------------

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(
          startDate as string
        );
      }

      if (endDate) {
        const end = new Date(endDate as string);

        // Include entire end date
        end.setHours(23, 59, 59, 999);

        filter.date.$lte = end;
      }
    }

    // --------------------------------
    // 4. Pagination
    // --------------------------------

    const currentPage = Math.max(
      Number(page),
      1
    );

    const itemsPerPage = Math.min(
      Math.max(Number(limit), 1),
      100
    );

    const skip =
      (currentPage - 1) * itemsPerPage;

    // --------------------------------
    // 5. Sorting
    // --------------------------------

    const allowedSortFields = [
      "date",
      "company",
      "category",
      "amount",
      "type",
      "status",
      "user",
    ];

    const selectedSortField =
      allowedSortFields.includes(
        sortBy as string
      )
        ? (sortBy as string)
        : "date";

    const sortDirection =
      sortOrder === "asc" ? 1 : -1;

    const sort: any = {
      [selectedSortField]: sortDirection,
    };

    // --------------------------------
    // 6. Query MongoDB
    // --------------------------------

    const transactions =
      await Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage);

    // --------------------------------
    // 7. Total count
    // --------------------------------

    const totalTransactions =
      await Transaction.countDocuments(filter);

    const totalPages = Math.ceil(
      totalTransactions / itemsPerPage
    );

    // --------------------------------
    // 8. Response
    // --------------------------------

    res.status(200).json({
      success: true,

      pagination: {
        currentPage,
        itemsPerPage,
        totalTransactions,
        totalPages,
      },

      filters: {
        search: search || "",
        category: category || "",
        status: status || "",
        user: user || "",
        startDate: startDate || "",
        endDate: endDate || "",
        minAmount: minAmount || "",
        maxAmount: maxAmount || "",
      },

      sorting: {
        sortBy: selectedSortField,
        sortOrder:
          sortOrder === "asc"
            ? "asc"
            : "desc",
      },

      transactions,
    });
  } catch (error) {
    console.error(
      "Transaction fetch error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};


export const getTransactionFilterOptions =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const categories =
        await Transaction.distinct(
          "category"
        );

      const statuses =
        await Transaction.distinct(
          "status"
        );

      const users =
        await Transaction.distinct(
          "user_id"
        );

      res.status(200).json({
        success: true,

        options: {
          categories,
          statuses,
          users,
        },
      });
    } catch (error) {
      console.error(
        "Filter options error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch filter options",
      });
    }
  };


export const getAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: 1 });

    let totalRevenue = 0;
    let totalExpense = 0;

    const categoryTotals: Record<
      string,
      number
    > = {};

    const monthlyData: Record<
      string,
      {
        revenue: number;
        expense: number;
      }
    > = {};

    transactions.forEach(
      (transaction: any) => {
        const amount =
          Number(transaction.amount) || 0;

        const category =
          transaction.category;

        // Revenue / Expense
        if (category === "Revenue") {
          totalRevenue += amount;
        }

        if (category === "Expense") {
          totalExpense += amount;
        }

        // Category breakdown
        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          amount;

        // Monthly trend
        if (transaction.date) {
          const date = new Date(
            transaction.date
          );

          if (!isNaN(date.getTime())) {
            const month =
              date.toLocaleString("en-US", {
                month: "short",
              });

            if (!monthlyData[month]) {
              monthlyData[month] = {
                revenue: 0,
                expense: 0,
              };
            }

            if (
              category === "Revenue"
            ) {
              monthlyData[month].revenue +=
                amount;
            }

            if (
              category === "Expense"
            ) {
              monthlyData[month].expense +=
                amount;
            }
          }
        }
      }
    );

    const balance =
      totalRevenue - totalExpense;

    const categoryBreakdown =
      Object.entries(categoryTotals).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

    const monthlyTrend =
      Object.entries(monthlyData).map(
        ([month, values]) => ({
          month,
          revenue: values.revenue,
          expense: values.expense,
        })
      );

    res.status(200).json({
      success: true,

      summary: {
        totalRevenue,
        totalExpense,
        balance,
        totalTransactions:
          transactions.length,
      },

      categoryBreakdown,

      monthlyTrend,
    });
  } catch (error) {
    console.error(
      "Analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate analytics",
    });
  }
};


export const exportTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      columns,
      search,
      category,
      status,
      user,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "date",
      sortOrder = "desc",
    } = req.body;

    // --------------------------------
    // 1. Validate selected columns
    // --------------------------------

    if (
      !columns ||
      !Array.isArray(columns) ||
      columns.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select at least one column",
      });
    }

    // --------------------------------
    // 2. Allowed CSV columns
    // --------------------------------

    const allowedColumns = [
      "id",
      "date",
      "amount",
      "category",
      "status",
      "user_id",
      "user_profile",
    ];

    const invalidColumns = columns.filter(
      (column: string) =>
        !allowedColumns.includes(column)
    );

    if (invalidColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid export column selected",
      });
    }

    // --------------------------------
    // 3. Build same filters as table
    // --------------------------------

    const filter: any = {};

    if (search) {
      const searchRegex = new RegExp(
        search,
        "i"
      );

      filter.$or = [
        {
          category: searchRegex,
        },
        {
          status: searchRegex,
        },
        {
          user_id: searchRegex,
        },
      ];

      if (!isNaN(Number(search))) {
        filter.$or.push({
          id: Number(search),
        });
      }
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (user) {
      filter.user_id = user;
    }

    if (minAmount || maxAmount) {
      filter.amount = {};

      if (minAmount) {
        filter.amount.$gte =
          Number(minAmount);
      }

      if (maxAmount) {
        filter.amount.$lte =
          Number(maxAmount);
      }
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(
          startDate
        );
      }

      if (endDate) {
        const end = new Date(endDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        filter.date.$lte = end;
      }
    }

    // --------------------------------
    // 4. Sorting
    // --------------------------------

    const allowedSortFields = [
      "id",
      "date",
      "amount",
      "category",
      "status",
      "user_id",
    ];

    const selectedSortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : "date";

    const sortDirection =
      sortOrder === "asc" ? 1 : -1;

    const sort: any = {
      [selectedSortField]:
        sortDirection,
    };

    // --------------------------------
    // 5. Get transactions
    // --------------------------------

    const transactions =
      await Transaction.find(filter)
        .sort(sort)
        .lean();

    // --------------------------------
    // 6. Prepare CSV data
    // --------------------------------

    const csvData = transactions.map(
      (transaction: any) => {
        const row: any = {};

        columns.forEach(
          (column: string) => {
            row[column] =
              transaction[column] ?? "";
          }
        );

        return row;
      }
    );

    // --------------------------------
    // 7. Convert JSON → CSV
    // --------------------------------

    const parser = new Parser({
      fields: columns,
    });

    const csv = parser.parse(csvData);

    // --------------------------------
    // 8. Send CSV file
    // --------------------------------

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment(
      "financial-transactions.csv"
    );

    return res.send(csv);
  } catch (error) {
    console.error(
      "CSV export error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate CSV file",
    });
  }
};
