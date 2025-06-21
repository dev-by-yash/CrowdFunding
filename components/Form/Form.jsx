'use client';

import styled from 'styled-components';
import FormLeftWrapper from './Components/FormLeftWrapper';
import FormRightWrapper from './Components/FormRightWrapper';
import { createContext, useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json';

const FormState = createContext();

export const Form = () => {
  const [form, setForm] = useState({
    campaignTitle: '',
    story: '',
    requiredAmount: '',
    category: 'education',
  });

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [storyUrl, setStoryUrl] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [image, setImage] = useState(null);

  const FormHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ImageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const startCampaign = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (form.campaignTitle === '' || form.story === '' || form.requiredAmount === '' || !uploaded) {
      toast.warn('Please fill all fields and upload files');
      return;
    }

    setLoading(true);
    try {
      const contractAddress = process.env.NEXT_PUBLIC_ADDRESS;

      if (!contractAddress || !ethers.utils.isAddress(contractAddress)) {
        toast.error('Invalid or missing contract address');
        setLoading(false);
        return;
      }

      const contract = new ethers.Contract(contractAddress, CampaignFactory.abi, signer);
      const CampaignAmount = ethers.utils.parseEther(form.requiredAmount);

      const tx = await contract.createCampaign(
        form.campaignTitle,
        CampaignAmount,
        imageUrl,
        form.category,
        storyUrl
      );

      toast.info('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();
      const event = receipt.events?.find((e) => e.event === 'campaignCreated');
      const campaignAddr = event?.args?.campaignAddress || event?.args?.[3];

      if (campaignAddr) {
        setAddress(campaignAddr);
        toast.success('🎉 Campaign Created Successfully!');
      } else {
        toast.error('Campaign creation event not found');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.code === 4001 ? 'Transaction Rejected' : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) setLoading(false);
  }, [address]);

  return (
    <FormState.Provider
      value={{
        form,
        setForm,
        image,
        setImage,
        ImageHandler,
        FormHandler,
        setImageUrl,
        setStoryUrl,
        startCampaign,
        setUploaded,
      }}
    >
      <FormWrapper>
        <FormMain>
          {loading ? (
            <Spinner><ClipLoader size={60} color="#00b712" /></Spinner>
          ) : address !== '' ? (
            <Address>
              <h1>Campaign Started!</h1>
              <h1>{address}</h1>
              <Button onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}>
                Go To Campaign
              </Button>
            </Address>
          ) : (
            <FormInputsWrapper>
              <FormLeftWrapper />
              <FormRightWrapper />
            </FormInputsWrapper>
          )}
        </FormMain>
      </FormWrapper>
    </FormState.Provider>
  );
};

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FormMain = styled.div`
  width: 80%;
`;

const FormInputsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 45px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Spinner = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Address = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.bgSubDiv};
  border-radius: 8px;
  justify-content: center;
`;

const Button = styled.button`
  width: 50%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  margin-top: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: large;
`;

export default Form;
export { FormState };
