
export type RootStackParamList = {
    Home: undefined;
    plist: undefined;
    Update: undefined
    Selection: undefined;
    Live: { selectedDate: string | null; selectedSpecialty: string };
    AddPt: { selectedDate: string | null; selectedSpecialty: string }; //  AddPt route
    Feedback:  {selectedDate: string ; selectedSpecialty: string};
    Signup: undefined;
    CreateAcc: undefined;
    ConfirmEmailScreen: undefined;
    ForgotPasswordSreen: undefined;
    ResetPassword:undefined;
    PostOP: {selectedDate: string | null ; selectedSpecialty: string};
    DataEntry: { selectedDate: string | null; selectedSpecialty: string; patientId: string };


  };
