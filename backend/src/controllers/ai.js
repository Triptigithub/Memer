const { generateCaption, generateVibe } = require("../services/aiService");
const Joi = require('joi');

const tagsSchema = Joi.object({
  tags: Joi.array()
    .items(Joi.string().min(1).max(50))
    .min(1)
    .max(10)
    .required()
    .messages({
      'array.base': 'Tags must be an array',
      'array.min': 'At least one tag is required',
      'array.max': 'Maximum 10 tags allowed',
      'string.min': 'Each tag must have at least 1 character',
      'string.max': 'Each tag must be under 50 characters'
    })
});

exports.getCaption = async (req, res) => {
  try {
    const { error, value } = tagsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { tags } = value;
    const startTime = Date.now();
    const caption = await generateCaption(tags);
    const endTime = Date.now();
    
    const response = {
      status: 'success',
      data: {
        caption,
        tags: tags,
        generated_at: new Date().toISOString(),
        generation_time_ms: endTime - startTime
      }
    };

    res.json(response);
  } catch (error) {
    const errorResponse = {
      status: 'error',
      message: 'Failed to generate caption',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    };

    res.status(500).json(errorResponse);
  }
};

exports.getVibe = async (req, res) => {
  try {
    const { error, value } = tagsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { tags } = value;
    const startTime = Date.now();
    const vibe = await generateVibe(tags);
    const endTime = Date.now();
    
    const response = {
      status: 'success',
      data: {
        vibe,
        tags: tags,
        generated_at: new Date().toISOString(),
        generation_time_ms: endTime - startTime
      }
    };

    res.json(response);
  } catch (error) {
    const errorResponse = {
      status: 'error',
      message: 'Failed to generate vibe',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    };

    res.status(500).json(errorResponse);
  }
};