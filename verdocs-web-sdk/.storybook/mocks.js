import {rest} from 'msw';

export const handlers = [
  rest.get('http://localhost:8080/search/history', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(150),
      ctx.json({
        recent: [
          {
            id: '311cb7ec-46fd-4bd1-9fd2-c33214b78744',
            created_at: '2021-10-11T14:57:21Z',
            updated_at: '2021-10-11T14:57:21Z',
            profile_id: '4b2f21bc-ca2d-491f-b95f-0186a45f3ecf',
            organization_id: 'b3b9cfc5-12a1-4b60-af05-cafc3e1275de',
            params: {q: 'w9'},
          },
          {
            id: '9916a97e-53b6-4cd2-b339-522aac1d0ecc',
            created_at: '2021-10-10T14:57:21Z',
            updated_at: '2021-10-10T14:57:21Z',
            profile_id: '4b2f21bc-ca2d-491f-b95f-0186a45f3ecf',
            organization_id: 'b3b9cfc5-12a1-4b60-af05-cafc3e1275de',
            params: {q: 'lease', type: 'template'},
          },
        ],
        saved: [
          {
            id: '311cb7ec-46fd-4bd1-9fd2-c33214b78744',
            created_at: '2021-10-11T14:57:21Z',
            updated_at: '2021-10-11T14:57:21Z',
            profile_id: '4b2f21bc-ca2d-491f-b95f-0186a45f3ecf',
            organization_id: 'b3b9cfc5-12a1-4b60-af05-cafc3e1275de',
            name: 'W9 Forms',
            params: {q: 'w9'},
          },
          {
            id: '9916a97e-53b6-4cd2-b339-522aac1d0ecc',
            created_at: '2021-10-10T14:57:21Z',
            updated_at: '2021-10-10T14:57:21Z',
            profile_id: '4b2f21bc-ca2d-491f-b95f-0186a45f3ecf',
            organization_id: 'b3b9cfc5-12a1-4b60-af05-cafc3e1275de',
            name: 'Lease Templates',
            params: {q: 'lease', type: 'template'},
          },
        ],
      }),
    );
    // check the `state` request param to determine what to return for our mocked response
    // the values of state are determined in our `characters-list-rest.stories.tsx`
    // const {state} = req.params;
    // switch (state) {
    //   case 'small-list': {
    //     // return a successful response after a 1.5sec delay to show our loading indicator
    //     return res(ctx.status(200), ctx.delay(1500), ctx.json(smallCharCountResponse));
    //   }
    //   case 'error': {
    //     // return an error response of 404: Not Found
    //     return res(ctx.status(404), ctx.delay(1500), ctx.json({errorMessage: 'Failure'}));
    //   }
    //   default: {
    //     // return a successful response after a 1.5sec delay to show our loading indicator
    //     return res(ctx.status(200), ctx.delay(1500), ctx.json(largeCharCountResponse));
    //   }
    // }
  }),

  rest.post('http://localhost:8080/search/saved', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(150),
      ctx.json({
        searches: [
          {
            saved: true,
            name: 'Waiting for Signature',
            lastSearched: '2021-10-04T16:14:11Z',
            params: {type: 'document', status: ['pending', 'in-progress']},
          },
          {
            saved: true,
            name: 'Recently Completed',
            lastSearched: '2021-10-03T16:14:11Z',
            params: {type: 'document', status: ['completed']},
          },
        ],
      }),
    );
  }),
];
