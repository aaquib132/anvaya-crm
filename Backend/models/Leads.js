const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
    },
    source: {
      type: String,
      enum: [
        "Website",
        "Referral",
        "Cold Call",
        "Advertisement",
        "Email",
        "Other",
      ],
      required: [true, "Lead source is required"],
    },
    salesAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesAgent",
      required: [true, "Sales Agent is required"],
    },
    status: {
      type: String,
      required: true,
      enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
      default: "New",
    },
    tags: {
    type: [String],
  },
     timeToClose: {
    type: Number,
    required: [true, 'Time to Close is required'],
    min: [1, 'Time to Close must be a positive number'],  
  },
    priority: {
      type: String,
      required: true,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    closedAt: Date,
  },
  { timestamps: true },
);

leadSchema.pre("save", function () {
  this.updatedAt = Date.now();

  if (this.status === "Closed" && !this.closedAt) {
    this.closedAt = Date.now();
  }
});

module.exports = mongoose.model('Lead', leadSchema);
