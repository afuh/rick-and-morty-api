import { GraphQLError } from 'graphql'
import type { ValidationContext, ASTNode, FieldNode, InlineFragmentNode, FragmentSpreadNode } from 'graphql'

export const urlToId = (url: string | string[]) => {
  const getId = (str: string) => {
    const match = str.match(/\d+$/)
    return parseInt(match ? match[0] : '0')
  }
  return Array.isArray(url) ? url.map((item) => getId(item)) : [getId(url)]
}

// TODO: Should we use a package like graphql-armor instead of implementing our own depth limit?
export const depthLimit = (maxDepth: number) => (context: ValidationContext) => ({
  enter(node: ASTNode) {
    const check = (n: ASTNode, depth = 0): number => {
      if ('selectionSet' in n && n.selectionSet) {
        const childDepths = n.selectionSet.selections.map((s: FieldNode | InlineFragmentNode | FragmentSpreadNode) =>
          check(s, depth + 1)
        )
        return Math.max(depth, ...childDepths)
      }
      return depth
    }

    const currentDepth = check(node)
    if (currentDepth > maxDepth) {
      context.reportError(new GraphQLError(`Query depth limit of ${maxDepth} exceeded, found ${currentDepth}.`))
    }
  },
})
