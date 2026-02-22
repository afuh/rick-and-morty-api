import { GraphQLError } from 'graphql'
import type { ValidationContext, ASTNode, FieldNode, InlineFragmentNode, FragmentSpreadNode } from 'graphql'

/**
 * GraphQL validation rule to limit query depth.
 * @param maxDepth - Maximum allowed depth for a GraphQL query.
 *
 * @returns A validation rule function that checks query depth and reports errors if exceeded.
 */
export const depthLimit = (maxDepth: number) => (context: ValidationContext) => ({
  OperationDefinition(node: ASTNode) {
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
      context.reportError(
        new GraphQLError(`Query depth limit of ${maxDepth} exceeded, found ${currentDepth}.`, { nodes: node })
      )
    }
  },
})
