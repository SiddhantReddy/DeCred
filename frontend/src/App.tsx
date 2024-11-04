import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { IssuerPage } from './pages/IssuerPage';
import { HolderPage } from './pages/HolderPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/issuer" element={<IssuerPage />} />
        <Route path="/holder" element={<HolderPage />} />
      </Routes>
    </Router>
  );
};

export default App;

// // Define interfaces for props
// interface WalletButtonProps {
//   color: string;
//   onClick: () => void;
// }

// interface LoginScreenProps {
//   title: string;
//   color: string;
//   buttonColor: string;
//   onSuccess: () => void;
// }

// type PageType = "home" | "issuer-login" | "verifier-login" | "user-login";

// const App: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState<PageType>("home");
//   const [isConnected, setIsConnected] = useState<boolean>(false);

//   // Navigation function
//   const navigate = (page: PageType): void => setCurrentPage(page);

//   // Mock wallet connection function
//   const connectWallet = (): void => {
//     setIsConnected(true);
//     // Here you would typically handle the DID wallet connection
//   };

//   // Home component with login options
//   const Home: React.FC = () => (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="max-w-2xl mx-auto p-8">
//         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//           Welcome to DID Login Portal
//         </h1>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Issuer Login Card */}
//           <div
//             onClick={() => navigate("issuer-login")}
//             className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//           >
//             <h2 className="text-xl font-semibold mb-4 text-blue-600">
//               Login as Issuer
//             </h2>
//             <p className="text-gray-600">
//               Connect with your DID wallet to access issuer tools
//             </p>
//           </div>

//           {/* Verifier Login Card */}
//           <div
//             onClick={() => navigate("verifier-login")}
//             className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//           >
//             <h2 className="text-xl font-semibold mb-4 text-green-600">
//               Login as Verifier
//             </h2>
//             <p className="text-gray-600">
//               Connect with your DID wallet to verify credentials
//             </p>
//           </div>

//           {/* User Login Card */}
//           <div
//             onClick={() => navigate("user-login")}
//             className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//           >
//             <h2 className="text-xl font-semibold mb-4 text-purple-600">
//               Login as User
//             </h2>
//             <p className="text-gray-600">
//               Connect with your DID wallet to access your account
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Wallet Connection Button Component
//   const WalletButton: React.FC<WalletButtonProps> = ({ color, onClick }) => (
//     <button
//       onClick={onClick}
//       className={`w-full ${color} text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity`}
//     >
//       <Wallet size={24} />
//       <span className="font-semibold">Connect DID Wallet</span>
//     </button>
//   );

//   // Login Screen Component
//   const LoginScreen: React.FC<LoginScreenProps> = ({
//     title,
//     color,
//     buttonColor,
//     onSuccess,
//   }) => (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
//         <h2 className={`text-2xl font-bold mb-6 ${color}`}>{title}</h2>

//         {!isConnected ? (
//           <div className="space-y-6">
//             <p className="text-gray-600 mb-6">
//               Connect your DID wallet to access the platform securely. Make sure
//               you have your wallet set up and ready.
//             </p>
//             <WalletButton color={buttonColor} onClick={connectWallet} />
//           </div>
//         ) : (
//           <div className="text-center space-y-4">
//             <div className="text-green-600 font-semibold">
//               Wallet Connected Successfully!
//             </div>
//             <button
//               onClick={onSuccess}
//               className={`w-full ${buttonColor} text-white py-2 rounded-md hover:opacity-90 transition-opacity`}
//             >
//               Continue to Dashboard
//             </button>
//           </div>
//         )}

//         <button
//           onClick={() => {
//             setIsConnected(false);
//             navigate("home");
//           }}
//           className={`mt-4 ${color} hover:underline`}
//         >
//           Back to Home
//         </button>
//       </div>
//     </div>
//   );

//   // Role-specific login components
//   const IssuerLogin: React.FC = () => (
//     <LoginScreen
//       title="Issuer Login"
//       color="text-blue-600"
//       buttonColor="bg-blue-600"
//       onSuccess={() => console.log("Navigate to Issuer Dashboard")}
//     />
//   );

//   const VerifierLogin: React.FC = () => (
//     <LoginScreen
//       title="Verifier Login"
//       color="text-green-600"
//       buttonColor="bg-green-600"
//       onSuccess={() => console.log("Navigate to Verifier Dashboard")}
//     />
//   );

//   const UserLogin: React.FC = () => (
//     <LoginScreen
//       title="User Login"
//       color="text-purple-600"
//       buttonColor="bg-purple-600"
//       onSuccess={() => console.log("Navigate to User Dashboard")}
//     />
//   );

//   // Render current page based on state
//   const renderPage = (): JSX.Element => {
//     switch (currentPage) {
//       case "issuer-login":
//         return <IssuerLogin />;
//       case "verifier-login":
//         return <VerifierLogin />;
//       case "user-login":
//         return <UserLogin />;
//       default:
//         return <Home />;
//     }
//   };

//   return renderPage();
// };

// export default App;
