import { createStyleContext } from '@pandacss/react';

import { tabsRecipe } from '../recipes/tabs.recipe';

const { withProvider, withContext } = createStyleContext(tabsRecipe);
