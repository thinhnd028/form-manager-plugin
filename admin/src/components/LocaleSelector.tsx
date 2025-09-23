import { Box, SingleSelect, SingleSelectOption, Typography } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';

interface Locale {
  id: number;
  name: string;
  code: string;
  isDefault: boolean;
}

interface LocaleSelectorProps {
  onLocaleChange: (locale: string) => void;
  currentLocale?: string;
}

const LocaleSelector = ({ onLocaleChange, currentLocale }: LocaleSelectorProps) => {
  const [locales, setLocales] = useState<Locale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocale, setSelectedLocale] = useState<string>(currentLocale || '');
  const { get } = useFetchClient();

  useEffect(() => {
    fetchLocales();
  }, []);

  const fetchLocales = async () => {
    try {
      setLoading(true);
      const response = await get('/i18n/locales');
      setLocales(response.data || []);

      // Set default locale if none selected
      if (!currentLocale && response.data?.length > 0) {
        const defaultLocale = response.data.find((locale: Locale) => locale.isDefault) || response.data[0];
        setSelectedLocale(defaultLocale.code);
        onLocaleChange(defaultLocale.code);
      }
    } catch (error) {
      console.error('Error fetching locales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocaleChange = (value: string) => {
    setSelectedLocale(value);
    onLocaleChange(value);
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="pi">Loading locales...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SingleSelect
        value={selectedLocale}
        onValueChange={handleLocaleChange}
        size="S"
      >
        {locales.map((locale) => (
          <SingleSelectOption key={locale.id} value={locale.code}>
            {locale.name}
          </SingleSelectOption>
        ))}
      </SingleSelect>
    </Box>
  );
};

export { LocaleSelector };
