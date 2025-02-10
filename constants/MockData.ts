export const MOCK_USER = {
  name: 'user',
  phone: '123',
  type: 'farmer', // or 'laborer'
};

export const MOCK_JOBS = [
  {
    id: '1',
    title: 'Rice Field Workers Needed',
    description: 'Looking for experienced workers for rice field cultivation. Tasks include planting, weeding, and general maintenance.',
    location: 'Bangalore Rural',
    wage: '₹500/day',
    duration: '5 days',
    workersNeeded: 5,
    skills: ['Rice Farming', 'Physical Labor', 'Agriculture'],
    status: 'active',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
  },
  {
    id: '2',
    title: 'Harvest Support',
    description: 'Immediate requirement for wheat harvest support. Experience in operating harvesting equipment preferred.',
    location: 'Mysore',
    wage: '₹450/day',
    duration: '7 days',
    workersNeeded: 3,
    skills: ['Harvesting', 'Equipment Operation'],
    status: 'active',
    image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1',
  },
  // Add more mock jobs...
];

export const MOCK_APPLICATIONS = [
  {
    id: '1',
    jobId: '1',
    applicant: {
      id: '1',
      name: 'Rajesh Kumar',
      age: 28,
      experience: '5 years',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    status: 'pending',
    appliedAt: '2024-01-15',
  },
  // Add more mock applications...
];

export const MOCK_STATS = {
  farmer: {
    activeJobs: 2,
    totalApplicants: 10,
    completedJobs: 15,
    rating: 4.8,
  },
  laborer: {
    activeApplications: 3,
    totalEarnings: '₹15,000',
    completedJobs: 12,
    rating: 4.5,
  },
};

export const BACKGROUND_IMAGES = {
  auth: {
    signIn: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2',
    userType: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854',
  },
  farmer: {
    home: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
    profile: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9',
  },
  laborer: {
    home: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1',
    profile: 'https://images.unsplash.com/photo-1569235186275-626cb53b83ce',
  },
}; 