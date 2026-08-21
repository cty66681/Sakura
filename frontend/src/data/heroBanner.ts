export interface HeroBannerItem {
  id: number;
  title: string;
  subtitle: string;
  button: string;
  image: string;
  href: string;
}

export const heroBanners: HeroBannerItem[] = [
  {
    id: 1,
    title: "东京国际文化学院",
    subtitle: "2027年4月生火热招生中",
    button: "查看学校",
    image: "/images/banner/banner-school-1.png",
    href: "/schools/language/1",
  },
  {
    id: 2,
    title: "东京 IT 高薪招聘",
    subtitle: "Java / React / AI 最新职位",
    button: "查看工作",
    image: "/images/banner/banner-job-1.jpg",
    href: "/jobs",
  },
  {
    id: 3,
    title: "东京优质房源推荐",
    subtitle: "留学生、上班族都适合",
    button: "查看房源",
    image: "/images/banner/banner-house-1.jpg",
    href: "/houses",
  },
];