import { useTranslation } from 'react-i18next';
import * as z from 'zod';

const { t } = useTranslation();

export const nutrientCategoriesSchema = z.object({
  code: z.string().min(3, { message: t('require.pleaseInput') }),
  nameEng: z.string().min(3, { message: t('require.pleaseInput') }),
  nameThai: z.string().min(3, { message: t('require.pleaseInput') }),
});

export type NutrientCategoriesFormValues = z.infer<typeof nutrientCategoriesSchema>;