'use client';

import styled from 'styled-components';
import { FormState } from '../Form';
import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';

// Upload to IPFS using Pinata
const uploadToIPFS = async (file) => {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to upload to Pinata');
    }

    const data = await response.json();
    return data.IpfsHash;
  } catch (err) {
    console.error('Pinata upload error:', err);
    throw new Error('Failed to upload to IPFS via Pinata: ' + err.message);
  }
};

const FormRightWrapper = () => {
  const Handler = useContext(FormState);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setWalletConnected(accounts.length > 0);
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          setWalletConnected(false);
        }
      }
    };
    checkWalletConnection();
  }, []);

  const uploadFiles = async (e) => {
    e.preventDefault();

    if (!walletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!Handler.image) {
      toast.error('Please select an image first');
      return;
    }

    if (Handler.form.story === '') {
      toast.error('Please add a story');
      return;
    }

    setUploadLoading(true);

    try {
      const storyFile = new Blob([Handler.form.story], { type: 'text/plain' });
      const storyHash = await uploadToIPFS(storyFile);
      Handler.setStoryUrl(storyHash);

      const imageHash = await uploadToIPFS(Handler.image);
      Handler.setImageUrl(imageHash);

      setUploaded(true);
      Handler.setUploaded(true);
      toast.success('Files Uploaded Successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Error uploading files to IPFS');
    }

    setUploadLoading(false);
  };

  const handleSubmit = (e) => {
    console.log("🟢 Form submitted");
    console.log("⏳ Calling startCampaign...");
    Handler.startCampaign(e);
  };

  if (!mounted) return null;

  return (
    <FormRight>
      <FormInput>
        <FormRow>
          <RowFirstInput>
            <label>Required Amount</label>
            <Input
              onChange={Handler.FormHandler}
              value={Handler.form.requiredAmount}
              name="requiredAmount"
              type="number"
              placeholder="Required Amount"
              suppressHydrationWarning
            />
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select
              onChange={Handler.FormHandler}
              value={Handler.form.category}
              name="category"
              suppressHydrationWarning
            >
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="animal">Animal</option>
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>

      <FormInput>
        <label>Select Image</label>
        <Image
          alt="campaign image"
          onChange={Handler.ImageHandler}
          type="file"
          accept="image/*"
          suppressHydrationWarning
        />
      </FormInput>

      {!walletConnected ? (
        <Button style={{ backgroundColor: '#ff4444' }} disabled>
          Please Connect Wallet First
        </Button>
      ) : uploadLoading ? (
        <Button disabled>
          <ClipLoader size={20} color="#ffffff" />
        </Button>
      ) : !uploaded ? (
        <Button onClick={uploadFiles}>Upload Files to IPFS</Button>
      ) : (
        <Button style={{ cursor: 'no-drop' }} disabled>
          Files uploaded Successfully
        </Button>
      )}

      <Button onClick={handleSubmit}>Start Campaign</Button>
    </FormRight>
  );
};

export default FormRightWrapper;

const FormRight = styled.div`
  width: 48%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;


const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'poppins';
  margin-top: 10px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Input = styled.input`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const RowFirstInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const RowSecondInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const Select = styled.select`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const Image = styled.input`
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;

  &::-webkit-file-upload-button {
    padding: 15px;
    background-color: ${(props) => props.theme.bgSubDiv};
    color: ${(props) => props.theme.color};
    outline: none;
    border: none;
    font-weight: bold;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  margin-top: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: large;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
`;
