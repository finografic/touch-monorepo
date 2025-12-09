// ======================================================================== //
// NOTE: REQUEST - PARENT TYPE "vino" CUID: cmid93hj30001cq7njlsiwvt8
// [POST] http://localhost:4040/api/drink-types/cmid93hj30001cq7njlsiwvt8/subtypes

export const POST_drinkSubtypes_REQUEST = {
  name: 'rose',
  defaultTempConsume: 5,
  defaultTempFreeze: -2,
  translations: { 'en-GB': '', 'es-ES': 'ROSE', 'ca-ES': '' },
};

// ======================================================================== //
// NOTE: RESPONSE

export const POST_drinkSubtypes_RESPONSE = {
  id: 'cmiy9xqeq0001fi7nbfnkdhlh',
  drinkTypeId: 'cmid93hj30001cq7njlsiwvt8',
  name: 'rose',
  translations: {
    'en-GB': '',
    'es-ES': 'ROSE',
    'ca-ES': '',
  },
  defaultTempConsume: 5,
  defaultTempFreeze: -2,
  isActive: true,
  createdAt: '2025-12-09T07:43:52.000Z',
  updatedAt: '2025-12-09T07:43:52.000Z',
};
