import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { roadmapData } from '@/data/roadmapData';

export const seedRoadmapToFirestore = async () => {
  try {
    const promises = Object.keys(roadmapData).map(key => {
      const roadmapRef = doc(db, 'roadmaps', key);
      return setDoc(roadmapRef, roadmapData[key]);
    });
    await Promise.all(promises);
    console.log("Successfully seeded ALL roadmaps to Firestore");
  } catch (error) {
    console.error("Error seeding roadmaps:", error);
  }
};
