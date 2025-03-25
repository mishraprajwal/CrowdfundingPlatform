import React, { useContext, createContext, ReactNode } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

interface CampaignForm {
  title: string;
  description: string;
  target: string;
  deadline: string;
  image: string;
}

interface StateContextType {
  address: string | undefined;
  contract: any; // Replace with a proper contract type if available
  connect: () => void;
  createCampaign: (form: CampaignForm) => Promise<void>;
  getCampaigns: () => Promise<any>;
  getUserCampaigns: () => Promise<any>;
  donate: (pId: number, amount: string) => Promise<any>;
  getDonations: (pId: number) => Promise<any>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateContextProviderProps {
  children: ReactNode;
}

export const StateContextProvider: React.FC<StateContextProviderProps> = ({ children }) => {
  const { contract } = useContract('0x16350e345da499907Ae26E9881151A414E72B396');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form: CampaignForm): Promise<void> => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline
          form.image,
        ],
      });
      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async (): Promise<any> => {
    if (!contract) return [];
    const campaigns = await contract.call('getCampaigns');
    const parsedCampaigns = campaigns.map((campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));
    return parsedCampaigns;
  };

  const getUserCampaigns = async (): Promise<any> => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter((campaign: any) => campaign.owner === address);
    return filteredCampaigns;
  };

  const donate = async (pId: number, amount: string): Promise<any> => {
    if (!contract) return;
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });
    return data;
  };

  const getDonations = async (pId: number): Promise<any> => {
    if (!contract) return [];
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;
    const parsedDonations: any[] = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateContextProvider');
  }
  return context;
};