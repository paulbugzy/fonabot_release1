import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { credentialService } from '../services/credentialService';

const SettingsContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const SettingsCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.xl};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: ${theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
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
  max-width: 500px;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  max-width: 200px;
  
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
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.md};
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.background};
  margin-bottom: ${theme.spacing.lg};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${props => props.$active ? 'white' : theme.colors.background};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  font-weight: ${props => props.$active ? '600' : '400'};
  
  &:hover {
    background: white;
  }
`;

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [accountForm, setAccountForm] = useState({
    email: 'user@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [twilioForm, setTwilioForm] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
  });
  
  const [dialogflowForm, setDialogflowForm] = useState({
    projectId: '',
    credentials: '',
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    
    // Here you would call your API to update the account
    setSuccessMessage('Account settings updated successfully');
    setErrorMessage('');
  };
  
  const handleTwilioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      credentialService.saveCredential('TwilioMain', {
        accountSid: twilioForm.accountSid,
        authToken: twilioForm.authToken,
        phoneNumber: twilioForm.phoneNumber,
      }, 'Main Twilio account');
      
      setSuccessMessage('Twilio credentials saved successfully');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to save Twilio credentials');
      console.error('Error saving Twilio credentials:', error);
    }
  };
  
  const handleDialogflowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let credentials;
      try {
        credentials = JSON.parse(dialogflowForm.credentials);
      } catch (e) {
        setErrorMessage('Invalid JSON format for credentials');
        return;
      }
      
      credentialService.saveCredential('DialogflowMain', {
        projectId: dialogflowForm.projectId,
        credentials,
      }, 'Main Dialogflow project');
      
      setSuccessMessage('Dialogflow credentials saved successfully');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to save Dialogflow credentials');
      console.error('Error saving Dialogflow credentials:', error);
    }
  };

  return (
    <SettingsContainer>
      <h1>Settings</h1>
      
      <TabContainer>
        <Tab 
          $active={activeTab === 'account'} 
          onClick={() => setActiveTab('account')}
        >
          Account
        </Tab>
        <Tab 
          $active={activeTab === 'twilio'} 
          onClick={() => setActiveTab('twilio')}
        >
          Twilio
        </Tab>
        <Tab 
          $active={activeTab === 'dialogflow'} 
          onClick={() => setActiveTab('dialogflow')}
        >
          Dialogflow
        </Tab>
      </TabContainer>
      
      {activeTab === 'account' && (
        <SettingsCard>
          <h2>Account Settings</h2>
          <Form onSubmit={handleAccountSubmit}>
            <FormGroup>
              <Label>Email Address</Label>
              <Input 
                type="email" 
                value={accountForm.email}
                onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                disabled
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Current Password</Label>
              <Input 
                type="password" 
                value={accountForm.currentPassword}
                onChange={(e) => setAccountForm({...accountForm, currentPassword: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>New Password</Label>
              <Input 
                type="password" 
                value={accountForm.newPassword}
                onChange={(e) => setAccountForm({...accountForm, newPassword: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input 
                type="password" 
                value={accountForm.confirmPassword}
                onChange={(e) => setAccountForm({...accountForm, confirmPassword: e.target.value})}
              />
            </FormGroup>
            
            <Button type="submit">Update Account</Button>
            
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </Form>
        </SettingsCard>
      )}
      
      {activeTab === 'twilio' && (
        <SettingsCard>
          <h2>Twilio Integration</h2>
          <Form onSubmit={handleTwilioSubmit}>
            <FormGroup>
              <Label>Account SID</Label>
              <Input 
                type="text" 
                value={twilioForm.accountSid}
                onChange={(e) => setTwilioForm({...twilioForm, accountSid: e.target.value})}
                placeholder="Enter your Twilio Account SID"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Auth Token</Label>
              <Input 
                type="password" 
                value={twilioForm.authToken}
                onChange={(e) => setTwilioForm({...twilioForm, authToken: e.target.value})}
                placeholder="Enter your Twilio Auth Token"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Phone Number</Label>
              <Input 
                type="text" 
                value={twilioForm.phoneNumber}
                onChange={(e) => setTwilioForm({...twilioForm, phoneNumber: e.target.value})}
                placeholder="+1234567890"
              />
            </FormGroup>
            
            <Button type="submit">Save Credentials</Button>
            
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </Form>
        </SettingsCard>
      )}
      
      {activeTab === 'dialogflow' && (
        <SettingsCard>
          <h2>Dialogflow Integration</h2>
          <Form onSubmit={handleDialogflowSubmit}>
            <FormGroup>
              <Label>Project ID</Label>
              <Input 
                type="text" 
                value={dialogflowForm.projectId}
                onChange={(e) => setDialogflowForm({...dialogflowForm, projectId: e.target.value})}
                placeholder="Enter your Dialogflow Project ID"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Service Account Credentials (JSON)</Label>
              <textarea
                value={dialogflowForm.credentials}
                onChange={(e) => setDialogflowForm({...dialogflowForm, credentials: e.target.value})}
                placeholder="Paste your service account JSON here"
                rows={10}
                style={{
                  padding: theme.spacing.md,
                  border: `1px solid ${theme.colors.background}`,
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  maxWidth: '100%',
                }}
              />
            </FormGroup>
            
            <Button type="submit">Save Credentials</Button>
            
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </Form>
        </SettingsCard>
      )}
    </SettingsContainer>
  );
};