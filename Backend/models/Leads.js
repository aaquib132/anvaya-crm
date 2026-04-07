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
        "Social Media",
        "Direct",
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
      required: false, // Allow unassigned leads
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
    min: [0, 'Time to Close must be a non-negative number'],  
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
