import {
  getModelForClass,
  prop,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Review {
  @prop()
  public reviewerName!: string;
}

export const ReviewModel = getModelForClass(Review);
