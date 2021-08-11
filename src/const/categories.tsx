import {
  DesktopMac,
  ShoppingCart,
  Fastfood,
  KingBed,
  LocalCafe,
  LocalBar,
  LocalMall,
  Face,
  LocalHospital,
  LocalGasStation,
  House,
  DirectionsBus,
  People,
  Movie,
  Atm,
  CardGiftcard,
  MoreHoriz,
} from '@material-ui/icons';
import { ReactNode } from 'react';

type Category = {
  label: string;
  icon: string;
  ListIcon: ReactNode;
};

export const allCategories: Category[] = [
  { label: '음식점', icon: '🍔🍕🍝🍚🍣🍜', ListIcon: <Fastfood /> },
  { label: '카페 · 베이커리', icon: '☕🥐🍰🍨', ListIcon: <LocalCafe /> },
  { label: '생필품', icon: '🧴🪥🧻', ListIcon: <ShoppingCart /> },
  { label: '식재료', icon: '🧅🧄🥔🥦', ListIcon: <ShoppingCart /> },
  { label: '마트 · 편의점', icon: '🛒', ListIcon: <ShoppingCart /> },
  { label: '전자제품', icon: '🖥📱⌨️', ListIcon: <DesktopMac /> },
  { label: '가구', icon: '🛏🛋🪑', ListIcon: <KingBed /> },
  { label: '의류 · 잡화', icon: '👗👜💄', ListIcon: <LocalMall /> },
  { label: '술 · 유흥', icon: '🍺🍶🍷', ListIcon: <LocalBar /> },
  { label: '미용실 · 피부과', icon: '💇‍️💆‍', ListIcon: <Face /> },
  { label: '병원 · 약국', icon: '🏥', ListIcon: <LocalHospital /> },
  { label: '자동차', icon: '🚘', ListIcon: <LocalGasStation /> },
  { label: '숙박', icon: '🏨', ListIcon: <House /> },
  { label: '교통', icon: '🚎', ListIcon: <DirectionsBus /> },
  { label: '친구 · 모임', icon: '👯', ListIcon: <People /> },
  { label: '문화 · 여가', icon: '🎬', ListIcon: <Movie /> },
  { label: '경조사', icon: '👰‍', ListIcon: <Atm /> },
  { label: '선물', icon: '🎁', ListIcon: <CardGiftcard /> },
  { label: '기타', icon: '🤷‍', ListIcon: <MoreHoriz /> },
];

export function getCategoryIcon(icon: string): ReactNode | null {
  const category = allCategories.find(({ label }) => label === icon);
  if (!category) {
    return null;
  }

  return category.ListIcon;
}

export const mappingCategory = (categoryGroup: string) => {
  if (/음식점|식당/gi.test(categoryGroup)) {
    return '음식점';
  }
  if (/슈퍼|마트|편의점|백화점|아울렛/gi.test(categoryGroup)) {
    return '마트 · 편의점';
  }
  if (/주차장|주유소|충전소|대리/gi.test(categoryGroup)) {
    return '자동차';
  }
  if (/문화|관광|영화|극장|볼링|당구|노래|스키|보드/gi.test(categoryGroup)) {
    return '문화 · 여가';
  }
  if (/숙박/gi.test(categoryGroup)) {
    return '숙박';
  }
  if (/카페/gi.test(categoryGroup)) {
    return '카페 · 베이커리';
  }
  if (/병원|약국/gi.test(categoryGroup)) {
    return '병원 · 약국';
  }
  if (/화장품/gi.test(categoryGroup)) {
    return '화장품';
  }
  if (/주류/gi.test(categoryGroup)) {
    return '술 · 유흥';
  }
  if (/의류/gi.test(categoryGroup)) {
    return '의류';
  }
  if (/미용|피부/gi.test(categoryGroup)) {
    return '미용실 · 피부과';
  }
  return '기타';
};
