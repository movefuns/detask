import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { getFullnodeUrl } from "@mysten/sui.js/client";
import {
  ThemeVars ,
  
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
// import { FirstPage } from "./components/component/first-page.tsx";


export const lightTheme: ThemeVars = {
	blurs: {
		modalOverlay: 'blur(0)',
	},
	backgroundColors: {
		primaryButton: '#F6F7F9',
		primaryButtonHover: '#F0F2F5',
		outlineButtonHover: '#F4F4F5',
		modalOverlay: 'rgba(24 36 53 / 20%)',
		modalPrimary: 'white',
		modalSecondary: '#F7F8F8',
		iconButton: 'transparent',
		iconButtonHover: '#F0F1F2',
		dropdownMenu: '#FFFFFF',
		dropdownMenuSeparator: '#F3F6F8',
		walletItemSelected: 'white',
		walletItemHover: '#3C424226',
	},
	borderColors: {
		outlineButton: '#E4E4E7',
	},
	colors: {
		primaryButton: '#373737',
		outlineButton: '#373737',
		iconButton: '#000000',
		body: '#182435',
		bodyMuted: '#767A81',
		bodyDanger: '#FF794B',
	},
	radii: {
		small: '6px',
		medium: '8px',
		large: '12px',
		xlarge: '16px',
	},
	shadows: {
		primaryButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
		walletItemSelected: '0px 2px 6px rgba(0, 0, 0, 0.05)',
	},
	fontWeights: {
		normal: '400',
		medium: '500',
		bold: '600',
	},
	fontSizes: {
		small: '14px',
		medium: '16px',
		large: '18px',
		xlarge: '20px',
	},
	typography: {
		fontFamily:
			'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
		fontStyle: 'normal',
		lineHeight: '1.3',
		letterSpacing: '1',
	},
};

const queryClient = new QueryClient();

const { networkConfig, useNetworkVariable } = createNetworkConfig({
  // localnet: { url: getFullnodeUrl("localnet") ,variables: {
  //   myMovePackageId: '0x123',
  // }},
  devnet: {
      url: getFullnodeUrl("devnet"), variables: {
          myMovePackageId: '0x50ce2afbea2bf7c40f2c789fea79f704549102f8324d4a27a21ee9938e26d33e',
      }
  },
  testnet: {
      url: getFullnodeUrl("testnet"), variables: {
          myMovePackageId: '0x6364ed2b93248bb6f9fec5dd0e1bba32795ee7a00deded2a34a32c1e7dcd6c19',
      }
  },
  mainnet: {
      url: getFullnodeUrl("mainnet"), variables: {
          myMovePackageId: '0xad2d116d9aa4db57484007f5e20242ff206530b8d763693a276ae36b397c4786',
      }
  },
});
//
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <Theme appearance="light">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
          <WalletProvider autoConnect theme={lightTheme}>
            <App useNetworkVariable={useNetworkVariable} />
			
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  // </React.StrictMode>,
);
