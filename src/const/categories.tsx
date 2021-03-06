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
  { label: 'μμμ ', icon: 'πππππ£π', ListIcon: <Fastfood /> },
  { label: 'μΉ΄ν Β· λ² μ΄μ»€λ¦¬', icon: 'βπ₯π°π¨', ListIcon: <LocalCafe /> },
  { label: 'μνν', icon: 'π§΄πͺ₯π§»', ListIcon: <ShoppingCart /> },
  { label: 'μμ¬λ£', icon: 'π§π§π₯π₯¦', ListIcon: <ShoppingCart /> },
  { label: 'λ§νΈ Β· νΈμμ ', icon: 'π', ListIcon: <ShoppingCart /> },
  { label: 'μ μμ ν', icon: 'π₯π±β¨οΈ', ListIcon: <DesktopMac /> },
  { label: 'κ°κ΅¬', icon: 'πππͺ', ListIcon: <KingBed /> },
  { label: 'μλ₯ Β· μ‘ν', icon: 'πππ', ListIcon: <LocalMall /> },
  { label: 'μ  Β· μ ν₯', icon: 'πΊπΆπ·', ListIcon: <LocalBar /> },
  { label: 'λ―Έμ©μ€ Β· νΌλΆκ³Ό', icon: 'πβοΈπβ', ListIcon: <Face /> },
  { label: 'λ³μ Β· μ½κ΅­', icon: 'π₯', ListIcon: <LocalHospital /> },
  { label: 'μλμ°¨', icon: 'π', ListIcon: <LocalGasStation /> },
  { label: 'μλ°', icon: 'π¨', ListIcon: <House /> },
  { label: 'κ΅ν΅', icon: 'π', ListIcon: <DirectionsBus /> },
  { label: 'μΉκ΅¬ Β· λͺ¨μ', icon: 'π―', ListIcon: <People /> },
  { label: 'λ¬Έν Β· μ¬κ°', icon: 'π¬', ListIcon: <Movie /> },
  { label: 'κ²½μ‘°μ¬', icon: 'π°β', ListIcon: <Atm /> },
  { label: 'μ λ¬Ό', icon: 'π', ListIcon: <CardGiftcard /> },
  { label: 'κΈ°ν', icon: 'π€·β', ListIcon: <MoreHoriz /> },
];

export function getCategoryIcon(icon: string): ReactNode | null {
  const category = allCategories.find(({ label }) => label === icon);
  if (!category) {
    return null;
  }

  return category.ListIcon;
}

export const mappingCategory = (categoryGroup: string) => {
  if (/μμμ |μλΉ/gi.test(categoryGroup)) {
    return 'μμμ ';
  }
  if (/μνΌ|λ§νΈ|νΈμμ |λ°±νμ |μμΈλ /gi.test(categoryGroup)) {
    return 'λ§νΈ Β· νΈμμ ';
  }
  if (/μ£Όμ°¨μ₯|μ£Όμ μ|μΆ©μ μ|λλ¦¬/gi.test(categoryGroup)) {
    return 'μλμ°¨';
  }
  if (/λ¬Έν|κ΄κ΄|μν|κ·Ήμ₯|λ³Όλ§|λΉκ΅¬|λΈλ|μ€ν€|λ³΄λ/gi.test(categoryGroup)) {
    return 'λ¬Έν Β· μ¬κ°';
  }
  if (/μλ°/gi.test(categoryGroup)) {
    return 'μλ°';
  }
  if (/μΉ΄ν/gi.test(categoryGroup)) {
    return 'μΉ΄ν Β· λ² μ΄μ»€λ¦¬';
  }
  if (/λ³μ|μ½κ΅­/gi.test(categoryGroup)) {
    return 'λ³μ Β· μ½κ΅­';
  }
  if (/νμ₯ν/gi.test(categoryGroup)) {
    return 'νμ₯ν';
  }
  if (/μ£Όλ₯/gi.test(categoryGroup)) {
    return 'μ  Β· μ ν₯';
  }
  if (/μλ₯/gi.test(categoryGroup)) {
    return 'μλ₯';
  }
  if (/λ―Έμ©|νΌλΆ/gi.test(categoryGroup)) {
    return 'λ―Έμ©μ€ Β· νΌλΆκ³Ό';
  }
  return 'κΈ°ν';
};
