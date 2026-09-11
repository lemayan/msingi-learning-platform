import { type SchemaTypeDefinition } from 'sanity'

// Objects
import { portableTextType } from './objects/portableTextType'
import { moduleType } from './objects/moduleType'
import { keyPointType } from './objects/keyPointType'
import { resourceType } from './objects/resourceType'
import { learningOutcomeType } from './objects/learningOutcomeType'

// Documents
import { categoryType } from './documents/categoryType'
import { instructorType } from './documents/instructorType'
import { lessonType } from './documents/lessonType'
import { courseType } from './documents/courseType'
import { videoDocType } from './documents/videoDocType'
import { learnerProgressType } from './documents/learnerProgressType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects (must be registered before documents that reference them)
    portableTextType,
    moduleType,
    keyPointType,
    resourceType,
    learningOutcomeType,
    // Documents
    categoryType,
    instructorType,
    lessonType,
    courseType,
    videoDocType,
    learnerProgressType,
  ],
}
