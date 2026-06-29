export type SearchCategory = "University" | "Sector" | "Degree" | "College";

export interface SearchResult {
  _id: string;
  name: string;
  description?: string;
  category: SearchCategory;
  link: string;
}

export interface SearchData {
  universities: SearchResult[];
  sectors: SearchResult[];
  degrees: SearchResult[];
  colleges: SearchResult[];
}

export interface Video {
  _id: string;
  videoFile: string;
  title: string;
  duration: string;
}

export interface Section {
  _id: string;
  title: string;
  videos: Video[];
  videoCount: number;
  duration: string;
}

export interface Subject {
  _id: string;
  link: string;
  title: string;
  videoCount: number;
  duration: string;
  sections: Section[];
}

export interface QuestionSet {
  _id: string;
  link: string;
  title: string;
  questionCount: number;
  duration?: number;
  setType: "past" | "mock";
}

export interface Course {
  _id: string;
  link: string;
  title: string;
  image: string;
  description: string;
  subjectCount: number;
  questionSetCount: number;
  videoCount: number;
  subjects: Subject[];
  questionSets: QuestionSet[];
}

export interface FaqType {
  question: string;
  answer: string;
}

export interface UniversityType {
  _id: string;
  name: string;
  location: string;
  logo: string;
  coverImage: string;
  students: number;
  ownership: string;
  description: string;
  foundedYear: string;
  establishments: string;
  link: string;
  degrees: [
    { sectorName: string; sectorLink: string; degrees: DegreeCardType[] },
  ];
  colleges: CollegeCardType[];
  faqs?: FaqType[];
}

export interface UniversityCardType {
  _id: string;
  name: string;
  location: string;
  logo: string;
  coverImage: string;
  students: number;
  ownership: string;
  link: string;
}

export interface DegreeType {
  _id: string;
  link: string;
  name: string;
  shortName: string;
  coverImage: string;
  description: string;
  university: {
    name: string;
    link: string;
  };
  sector: {
    name: string;
    link: string;
  };
  eligibilityCriteria: [
    {
      title: string;
      description: string;
    },
  ];
  gradingSystem?: [
    {
      letter: string;
      scale: string;
      point: string;
    },
  ];
  gradingTextUp?: string;
  gradingTextDown?: string;
  duration: number;
  semesterCount: number;
  courseStructure?: [
    {
      _id: string;
      title: string;
      electives?: [string];
      subjects?: [
        {
          _id: string;
          code: string;
          title: string;
          marks: string;
        },
      ];
    },
  ];
  colleges: CollegeCardType[];
}

export interface DegreeCardType {
  _id: string;
  link: string;
  name: string;
  shortName: string;
  coverImage: string;
  university: {
    name: string;
  };
  sector: {
    name: string;
  };
  duration: number;
  semesterCount: number;
}

export interface SectorType {
  _id: string;
  link: string;
  name: string;
  coverImage: string;
  description: string;
  areasOfStudy: {
    title: string;
    description: string;
  }[];
  careerProspect: {
    title: string;
    icon: string;
  }[];
  degrees: [{ _id: string; universityName: string; degrees: DegreeCardType[] }];
  colleges: CollegeCardType[];
}

export interface SectorCardType {
  _id: string;
  link: string;
  name: string;
  coverImage: string;
  description: string;
  degreesCount: number;
}

export interface CollegeType {
  _id: string;
  link: string;
  name: string;
  logo: string;
  coverImage: string;
  location: string;
  facebookLink?: string;
  instagramLink?: string;
  websiteLink?: string;
  emailLink?: string;
  university: {
    name: string;
    link: string;
  };
  degrees: DegreeCardType[];
  phoneNumber: string;
  heading: string;
  description: string;
  foundedYear: string;
  salientFeatures?: string[];
  gallery?: string[];
  faqs?: FaqType[];
  priority?: number;
}

export interface CollegeCardType {
  _id: string;
  name: string;
  link: string;
  logo: string;
  coverImage: string;
  location: string;
  foundedYear: string;
  degrees: [{ shortName: string; sector: string }];
  university: { name: string };
  featured?: boolean;
  className?: string;
}

export interface BlogCardType {
  _id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  readTime: number;
  blogImagePublicId: string;
  blogImageUrl: string;
  createdAt: Date;
}
