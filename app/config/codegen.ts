import type { CodegenConfig } from '@graphql-codegen/cli'
import { GRAPHQL_ENDPOINT } from './graphql'

const config: CodegenConfig = {
  schema: GRAPHQL_ENDPOINT,
  documents: ['app/**/*.{ts,tsx}'],
  generates: {
    './app/graphql/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
