import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { telephonyService } from '../services/telephonyService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.xl};
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.secondary};
  
  &:hover {
    color: ${theme.colors.text};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${theme.colors.text};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: #4338ca;
  }
  
  &:disabled {
    background-color: #a5a5a5;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  color: ${theme.colors.success};
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background-color: #ECFDF5;
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background-color: #FEE2E2;
  border-radius: 4px;
`;

interface TestCallModalProps {
  onClose: () => void;
}

export const TestCallModal = ({ onClose }: TestCallModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    if (!message.trim()) {
      setError('Message is required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await telephonyService.makeTestCall({
        phoneNumber,
        message,
      });
      
      setSuccess(`Test call initiated successfully! Call SID: ${response.callSid}`);
    } catch (err) {
      setError('Failed to initiate test call. Please check your credentials and try again.');
      console.error('Error making test call:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Make Test Call</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Message</Label>
            <TextArea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter the message to be spoken during the test call"
            />
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Initiating Call...' : 'Make Test Call'}
          </Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};