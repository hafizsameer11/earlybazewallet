const API_DOMAIN = "https://earlybaze.hmstech.xyz/api";

const API_ENDPOINTS = {
  AUTH: {
    Login: API_DOMAIN + "/auth/login",
    Register: API_DOMAIN + "/auth/register",
    Logout: API_DOMAIN + "/auth/logout",
    VerfiyEmailOtp: API_DOMAIN + "/auth/otp-verification",
    ResendOtp: API_DOMAIN + "/auth/resend-otp",
    ForgotPassword: API_DOMAIN + "/auth/forget-password",
    VerifyPasswordOtp: API_DOMAIN + "/auth/verify-forget-password-otp",
    ResetPassword: API_DOMAIN + "/auth/reset-password",
    CheckBvnStatus: API_DOMAIN + "/check-user-status",
    CheckBvnVerified: API_DOMAIN + "/check-bvn-status",
    VerifyUser: API_DOMAIN + "/verify-user",
  },
  USER: {
    SetPin: API_DOMAIN + "/user/set-pin",
    VerifyPin: API_DOMAIN + "/user/verify-pin",
    GetUserDetails: API_DOMAIN + "/user/details",
    GetAssestnTrans: API_DOMAIN + "/user-asset-transaction",
    GetInternalSend: API_DOMAIN + "/admin/transactions/get-singe/internal-send",
    GetInternalReceive: API_DOMAIN + "/admin/transactions/get-single/internal-receive",
    GetSwap: API_DOMAIN + "/wallet/single-swap",
    GetWithdraw: API_DOMAIN + "/withdraw-request-status",
    GetBuy: API_DOMAIN + "/wallet/single-buy",
    GetBalance: API_DOMAIN + "/user/balance",
    GetAssests: API_DOMAIN + "/user/assets",
    GetBankDetail: API_DOMAIN + "/get-bank-account",
    ChangePassword: API_DOMAIN + "/user/change-password",
    GetKycStatus: API_DOMAIN + "/kyc/get",
    CreatekycRequest: API_DOMAIN + "/kyc/create",
    GetTickets: API_DOMAIN + "/support/get-tickets",
    GetAllWithdrawal: API_DOMAIN + "/withdraw-requests",
    CreateSupportTicket: API_DOMAIN + "/support/create-ticket",
    GetSingleTicket: API_DOMAIN + "/support/get-ticket",
    GetAssets: API_DOMAIN + "/user/assets",
    GetWalletCurrency: API_DOMAIN + "/user/wallet-currencies",
    GetUserWalletCurrency: API_DOMAIN + "/user/all-wallet-currencies",
    
    GetWalletNetworks: API_DOMAIN + "/user/networks",
    GetTransactionCurrency: API_DOMAIN + "/transaction/currency",
    GetReceiveAddress: API_DOMAIN + "/user/deposit-address",
    GetWalletTransactions: API_DOMAIN + "/transaction/get-all",
    CreateReplyTicket: API_DOMAIN + "/support/send-reply",
    StoreBankDetails: API_DOMAIN + "/create-bank-account",
    UpdateBankDetails: API_DOMAIN + "/update-bank-account",
    DeleteBankAccount: API_DOMAIN + "/delete-bank-account",
    SendInternalTransfer: API_DOMAIN + "/wallet/internal-transfer",
    BuyTransfter: API_DOMAIN + "/wallet/buy",
    CalculateExchangeRate:
      API_DOMAIN + "/exchange-rate/calculate-exchange-rate",
      GetNgNExchangeRate:
      API_DOMAIN + "/exchange-rate/get-ngn-exchange-rate",
      GetReferral: API_DOMAIN + "/refferal/get-all",
      SwapTransfter: API_DOMAIN + "/wallet/swap",
      EditProfile: API_DOMAIN + "/user/update-profile",
      GetMarketData: API_DOMAIN + "/admin/market-data",
  },
  ACCOUNT_MANAGEMENT: {
    GetUserProfileData: API_DOMAIN + "/edit-profile-details",
    RequestBvnConsent: API_DOMAIN + "/accounts/bvn-consent",
    CreateIndividualAccount: API_DOMAIN + "/accounts/individual",
    CreateCoorporateAccount: API_DOMAIN + "/accounts/coorporate",
    ReleaseAccount: API_DOMAIN + "/accounts/release",
    DeleteAccount: API_DOMAIN + "/accounts",
    UpdatePassword: API_DOMAIN + "/update-password",
    UpdateEmail: API_DOMAIN + "/update-email",
    GetNotifications: API_DOMAIN + "/unread-notifications",
    markAllNotificationsAsRead: API_DOMAIN + "/mark-all-read",
    GetBillPaymentHistory: API_DOMAIN + "/get-billpayments",
    GetTransferHistory: API_DOMAIN + "/get-transfer",
    UpdateProfile: API_DOMAIN + "/update-profile",
    GetBalance: API_DOMAIN + "/balance",
    GetMonthlyStats: API_DOMAIN + "/monthly-stats",
    GetQuarterlyStats: API_DOMAIN + "/quarterly-stats",
    GetYearlyStats: API_DOMAIN + "/yearly-stats",
    GetSocialMediaLinks: API_DOMAIN + "/social-media-links",
    GetFaqs: API_DOMAIN + "/faq",
    GetSlides: API_DOMAIN + "/admin/banners",
    GetAllNotifications: API_DOMAIN + "/notification/get-all",
    PaymentProof: API_DOMAIN + '/wallet/attach-slip',
  },
  BILL_MANAGEMENT: {
    CreateWithdrawal: API_DOMAIN + "/withdraw/create",
    GetBillerCategories: API_DOMAIN + "/biller-categories-fetch",
    GetBillerProviders: API_DOMAIN + "/get-provider",
    GetBillerItems: API_DOMAIN + "/biller-items-fetch",
    GetBillerItemDetails: API_DOMAIN + "/biller-Item-details",
    ValidateCustomer: API_DOMAIN + "/Validate-Customer",
    PayBills: API_DOMAIN + "/payBills",
    DeleteBill: API_DOMAIN + "/bills",
    TransactionDetails: API_DOMAIN + "/transaction-details",
  },
  MONEY_TRANSFER: {
    GetBanks: API_DOMAIN + "/fetch-banks",
    Trasnsfer: API_DOMAIN + "/transfer",
    GetRecepientDetails: API_DOMAIN + "/recepient-details",
    GetTransactionStatus: API_DOMAIN + "/transaction-Status",
    GetFundAccountNo: API_DOMAIN + "/fund-account",
  },
};

export { API_DOMAIN, API_ENDPOINTS };
