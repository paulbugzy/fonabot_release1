import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { ivrFlowService } from '../services/ivrFlowService';
import { NODE_TYPES } from '../components/ivr-flow/nodes/types';

const Container = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.xl};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
`;

const TextArea = styled.textarea`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  input {
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
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
  
  &.secondary {
    background-color: white;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.background};
    
    &:hover {
      background-color: ${theme.colors.background};
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.sm};
  font-size: 0.9rem;
`;

export const CreateFlowPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Flow name is required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a basic flow with a start node
      const startNodeId = `${NODE_TYPES.START}-${Date.now()}`;
      
      const newFlow = await ivrFlowService.createFlow({
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        nodes: [
          {
            node_client_id: startNodeId,
            type: NODE_TYPES.START,
            position_x: 250,
            position_y: 100,
            properties: {
              label: 'Start',
            },
          },
        ],
        edges: [],
      });
      
      // Navigate to the flow builder
      navigate(`/flows/${newFlow.id}/builder`);
    } catch (err) {
      setError('Failed to create flow. Please try again.');
      console.error('Error creating flow:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>Create New IVR Flow</h1>
      
      <Card>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Flow Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Enter flow name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Description (Optional)</Label>
            <TextArea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Enter flow description"
            />
          </FormGroup>
          
          <FormGroup>
            <Checkbox>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
              />
              <Label style={{ margin: 0 }}>Active</Label>
            </Checkbox>
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ButtonGroup>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Flow'}
            </Button>
            <Button 
              type="button" 
              className="secondary"
              onClick={() => navigate('/flows')}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
};