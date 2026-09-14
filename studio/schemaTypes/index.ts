import { type SchemaTypeDefinition } from 'sanity'

// Objects
import { portableTextType } from './objects/portableTextType'
import { moduleType } from './objects/moduleType'
import { keyPointType } from './objects/keyPointType'
import { resourceType } from './objects/resourceType'
import { learningOutcomeType } from './objects/learningOutcomeType'
import { videoChapterType } from './objects/videoChapterType'
import { videoChunkType } from './objects/videoChunkType'

// Documents
import { categoryType } from './documents/categoryType'
import { instructorType } from './documents/instructorType'
import { lessonType } from './documents/lessonType'
import { courseType } from './documents/courseType'
import { videoType } from './documents/videoType'
import { learnerProgressType } from './documents/learnerProgressType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects (must be registered before documents that reference them)
    portableTextType,
    moduleType,
    keyPointType,
    resourceType,
    learningOutcomeType,
    videoChapterType,
    videoChunkType,
    // Documents
    categoryType,
    instructorType,
    lessonType,
    courseType,
    videoType,
    learnerProgressType,
  ],
}

