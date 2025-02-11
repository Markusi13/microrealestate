import * as Yup from 'yup';

import { Form, Formik } from 'formik';
import {
  NumberField,
  Section,
  SubmitButton,
  TextField,
} from '@microrealestate/commonui/components';
import { useCallback, useContext, useMemo } from 'react';

import { StoreContext } from '../../store';
import useTranslation from 'next-translate/useTranslation';

const validationSchema = Yup.object().shape({
  extracharge: Yup.number().min(0),
  noteextracharge: Yup.mixed().when('extracharge', {
    is: (val) => val > 0,
    then: Yup.string().required(),
  }),
  promo: Yup.number().min(0),
  notepromo: Yup.mixed().when('promo', {
    is: (val) => val > 0,
    then: Yup.string().required(),
  }),
});

const AdditionalCostDiscountForm = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const store = useContext(StoreContext);

  const initialValues = useMemo(
    () => ({
      extracharge:
        store.rent.selected.extracharge !== 0
          ? store.rent.selected.extracharge
          : '',
      noteextracharge: store.rent.selected.noteextracharge || '',
      promo: store.rent.selected.promo !== 0 ? store.rent.selected.promo : '',
      notepromo: store.rent.selected.notepromo || '',
    }),
    [store.rent.selected]
  );

  const _onSubmit = useCallback(
    async (values) => {
      const paymentPart = {
        ...values,
      };
      try {
        await onSubmit(paymentPart);
      } finally {
        if (!values.extracharge || values.extracharge === '0') {
          values.extracharge = '';
          values.noteextracharge = '';
        }
        if (!values.promo || values.promo === '0') {
          values.promo = '';
          values.notepromo = '';
        }
      }
    },
    [onSubmit]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={_onSubmit}
    >
      {({
        isSubmitting,
        values: { extracharge, noteextracharge, promo, notepromo },
      }) => {
        return (
          <Form autoComplete="off">
            <Section
              label={t('Additional cost')}
              defaultExpanded={!!initialValues.extracharge}
            >
              <NumberField
                label={t('Amount')}
                name="extracharge"
                value={extracharge}
              />
              <TextField
                label={t('Description')}
                name="noteextracharge"
                value={noteextracharge}
                multiline
                rows={3}
              />
            </Section>
            <Section
              label={t('Discount')}
              defaultExpanded={!!initialValues.promo}
            >
              <NumberField label={t('Discount')} name="promo" value={promo} />
              <TextField
                label={t('Description')}
                name="notepromo"
                value={notepromo}
                multiline
                rows={3}
              />
            </Section>
            <SubmitButton label={!isSubmitting ? t('Save') : t('Saving')} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default AdditionalCostDiscountForm;
