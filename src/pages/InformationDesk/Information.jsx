import * as React from 'react';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../Utility/urlInstance';
import logo from "../../mediaFiles/labEquipment.png";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// ✅ Correct icon imports:
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PhoneIcon from '@mui/icons-material/Phone';
import ScienceIcon from '@mui/icons-material/Science';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


// Custom theme for better appearance
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function Information() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEquipmentList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/equipments/getAllEquipmentDetails`);
      if (res?.data.data.length > 0) {
        setEquipments(res.data.data);
      } else {
        setEquipments([]);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to load equipment data');
      setEquipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEquipmentList();
  }, []);

  const handleEmailClick = (email) => {
    if (email && email !== 'N/A') {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  const handlePhoneClick = (phone) => {
    if (phone && phone !== 'N/A') {
      window.open(`tel:${phone}`, '_blank');
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return 'No guidelines provided';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Loading skeleton
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box className="mx-5 my-5">
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    maxWidth: '100%', 
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ThemeProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '400px',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: '#ef4444', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Unable to Load Equipment
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Chip 
            label="Try Again" 
            onClick={getEquipmentList}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
          />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="mx-5 my-5">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
              mb: 1
            }}
          >
            Available Laboratory Equipment
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Registered Equipments and Operators information
          </Typography>
        </Box>
        
        {equipments?.length > 0 ? (
          <Grid container spacing={3}>
            {equipments?.map((equipment) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={equipment.equipmentId}>
                <Card 
                  sx={{ 
                    maxWidth: '75%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(102, 126, 234, 0.2)',
                      border: '1px solid rgba(102, 126, 234, 0.3)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={equipment.equipmentName || "Lab Equipment"}
                    height="160"
                    image={logo}
                    sx={{ 
                      objectFit: 'cover',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12
                    }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Equipment Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScienceIcon sx={{ mr: 1, color: '#667eea' }} />
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="div"
                        sx={{ 
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #fff 0%, #a8b8d8 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent'
                        }}
                      >
                        {equipment.equipmentName}
                      </Typography>
                    </Box>

                    {/* Guidelines */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#FFFFFF',
                        mb: 2,
                        lineHeight: 1.6,
                        minHeight: '40px'
                      }}
                    >
                      {truncateText(equipment.guidelines, 120)}
                    </Typography>

                    {/* Operator Info Section */}
                    <Box 
                      sx={{ 
                        mt: 'auto',
                        pt: 2,
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: '#667eea',
                          fontWeight: 600,
                          mb: 1.5
                        }}
                      >
                        Operator Contact
                      </Typography>
                      
                      <Stack spacing={1.5}>
                        {/* Operator Name */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label="Name" 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              mr: 1,
                              borderColor: '#667eea',
                              color: '#667eea'
                            }}
                          />
                          <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                            {equipment.operatorName || 'Not assigned'}
                          </Typography>
                        </Box>

                        {/* Operator Email */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label="Email" 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                mr: 1,
                                borderColor: '#10b981',
                                color: '#10b981'
                              }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: equipment.operatorEmail ? '#10b981' : 'text.secondary',
                                cursor: equipment.operatorEmail ? 'pointer' : 'default'
                              }}
                              // onClick={() => handleEmailClick(equipment.operatorEmail)}
                           
                            >
                              {equipment.operatorEmail || 'N/A'}
                            </Typography>
                          </Box>
                          {equipment.operatorEmail && equipment.operatorEmail !== 'N/A' && (
                            <IconButton 
                              // size="small" 
                              // onClick={() => handleEmailClick(equipment.operatorEmail)}
                              sx={{ color: '#10b981' }}
                            >
                              <ContactMailIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>

                        {/* Operator Phone */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label="Phone" 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                mr: 1,
                                borderColor: '#f59e0b',
                                color: '#f59e0b'
                              }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: equipment.operatorPhoneNumber ? '#f59e0b' : 'text.secondary',
                                cursor: equipment.operatorPhoneNumber ? 'pointer' : 'default'
                              }}
                              onClick={() => handlePhoneClick(equipment.operatorPhoneNumber)}
                            >
                              {equipment.operatorPhoneNumber || 'N/A'}
                            </Typography>
                          </Box>
                          {equipment.operatorPhoneNumber && equipment.operatorPhoneNumber !== 'N/A' && (
                            <IconButton 
                              size="small" 
                              onClick={() => handlePhoneClick(equipment.operatorPhoneNumber)}
                              sx={{ color: '#f59e0b' }}
                            >
                              <PhoneIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Empty state
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '400px',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <ScienceIcon sx={{ fontSize: 64, color: '#6b7280', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Equipment Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              There are currently no laboratory equipment listed.
            </Typography>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}