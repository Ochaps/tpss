import * as Yup from 'yup'

export const computeSchema = Yup.object().shape({
  ID: Yup.number().required(),
  Amount: Yup.number().required(),
  Currency: Yup.string().required(),
  CustomerEmail: Yup.string().email().required(),
  SplitInfo: Yup.array()
    .of(
      Yup.object().shape({
        SplitType: Yup.string()
          .oneOf(['FLAT', 'PERCENTAGE', 'RATIO'])
          .required(),
        SplitValue: Yup.number().required(),
        SplitEntityId: Yup.string().required()
      })
    )
    .min(1)
    .max(20)
    .required()
})
