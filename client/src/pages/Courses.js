import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import {
  School as SchoolIcon,
  Timer as TimerIcon,
  MenuBook as MenuBookIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { courses } from '../data/courses';

const Courses = () => {
  const theme = useTheme();
  const [selectedTrimester, setSelectedTrimester] = useState('Trimester 1');
  const trimesters = Object.keys(courses);

  // Calculate total credits for selected trimester
  const totalCredits = Object.values(courses[selectedTrimester] || {}).reduce(
    (sum, course) => sum + course.credits,
    0
  );

  const handleTrimesterChange = (event) => {
    setSelectedTrimester(event.target.value);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'transparent' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Course Information
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
              Browse courses by trimester and explore detailed course information including credits, descriptions, and syllabus.
            </Typography>
          </Box>
          <Chip
            icon={<AssignmentIcon />}
            label={`Total Credits: ${totalCredits}`}
            color="primary"
            size="large"
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {trimesters.map((trimester) => (
            <Button
              key={trimester}
              variant={selectedTrimester === trimester ? "contained" : "outlined"}
              onClick={() => setSelectedTrimester(trimester)}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
              }}
            >
              {trimester}
            </Button>
          ))}
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {Object.entries(courses[selectedTrimester] || {}).map(([courseName, courseInfo]) => (
          <Grid item xs={12} md={6} key={courseName}>
            <Card 
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 28, mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {courseName}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        icon={<StarIcon sx={{ fontSize: 16 }} />}
                        label={`${courseInfo.credits} Credits`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={selectedTrimester}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2,
                    color: 'text.secondary',
                    minHeight: '60px',
                    lineHeight: 1.6
                  }}
                >
                  {courseInfo.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MenuBookIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1" fontWeight="medium">
                    Syllabus Topics
                  </Typography>
                </Box>

                <List dense>
                  {courseInfo.syllabus.map((topic, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <TimerIcon sx={{ fontSize: 16, color: theme.palette.primary.light }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={topic} 
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { 
                            fontWeight: 400,
                            lineHeight: 1.4
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Courses; 