
export type RootStackParamList = {
    Home: undefined;
    plist: undefined;
    Update: undefined
    Selection: undefined;
    Live: { selectedDate: string | null; selectedSpecialty: string };
    AddPt: { selectedDate: string | null; selectedSpecialty: string }; // Add this line to include the AddPt route
    Feedback:  {selectedDate: string | null; selectedSpecialty: string };
    Signup: undefined;
   
  };
  