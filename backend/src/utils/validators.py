import re
from typing import Dict, Any, List

def validate_phone_number(phone_number: str) -> Dict[str, Any]:
    """
    Validate phone number format
    """
    if not phone_number:
        return {'valid': False, 'error': 'Phone number is required'}
    
    # Remove all non-digit characters except +
    cleaned = re.sub(r'[^\d+]', '', phone_number)
    
    # Check if it starts with + and has 10-15 digits
    if re.match(r'^\+\d{10,15}$', cleaned):
        return {'valid': True, 'formatted': cleaned}
    
    # Check if it's a US number without country code
    if re.match(r'^\d{10}$', cleaned):
        return {'valid': True, 'formatted': f'+1{cleaned}'}
    
    return {'valid': False, 'error': 'Invalid phone number format'}

def validate_email(email: str) -> Dict[str, Any]:
    """
    Validate email address format
    """
    if not email:
        return {'valid': False, 'error': 'Email is required'}
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if re.match(email_pattern, email):
        return {'valid': True, 'formatted': email.lower()}
    
    return {'valid': False, 'error': 'Invalid email format'}

def validate_verification_code(code: str) -> Dict[str, Any]:
    """
    Validate verification code format
    """
    if not code:
        return {'valid': False, 'error': 'Verification code is required'}
    
    # Remove any spaces or dashes
    cleaned = re.sub(r'[\s-]', '', code)
    
    # Check if it's 4-8 digits
    if re.match(r'^\d{4,8}$', cleaned):
        return {'valid': True, 'formatted': cleaned}
    
    return {'valid': False, 'error': 'Verification code must be 4-8 digits'}

def validate_user_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate user data for onboarding
    """
    errors = []
    validated_data = {}
    
    # Validate user_id
    user_id = data.get('user_id', '').strip()
    if not user_id:
        errors.append('User ID is required')
    elif len(user_id) < 3:
        errors.append('User ID must be at least 3 characters')
    else:
        validated_data['user_id'] = user_id
    
    # Validate phone_number
    phone_validation = validate_phone_number(data.get('phone_number', ''))
    if not phone_validation['valid']:
        errors.append(phone_validation['error'])
    else:
        validated_data['phone_number'] = phone_validation['formatted']
    
    # Validate plan_type
    plan_type = data.get('plan_type', 'basic').lower()
    if plan_type not in ['basic', 'premium']:
        errors.append('Plan type must be either "basic" or "premium"')
    else:
        validated_data['plan_type'] = plan_type
    
    # Validate email if provided
    email = data.get('email', '').strip()
    if email:
        email_validation = validate_email(email)
        if not email_validation['valid']:
            errors.append(email_validation['error'])
        else:
            validated_data['email'] = email_validation['formatted']
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'data': validated_data
    }

def validate_document_request(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate document generation request
    """
    errors = []
    validated_data = {}
    
    # Validate user_id
    user_id = data.get('user_id', '').strip()
    if not user_id:
        errors.append('User ID is required')
    else:
        validated_data['user_id'] = user_id
    
    # Validate template_type
    template_type = data.get('template_type', '').strip()
    valid_templates = ['welcome_packet', 'contract', 'user_guide']
    if not template_type:
        errors.append('Template type is required')
    elif template_type not in valid_templates:
        errors.append(f'Template type must be one of: {", ".join(valid_templates)}')
    else:
        validated_data['template_type'] = template_type
    
    # Validate user_data
    user_data = data.get('user_data', {})
    if not isinstance(user_data, dict):
        errors.append('User data must be a dictionary')
    else:
        validated_data['user_data'] = user_data
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'data': validated_data
    }

def sanitize_input(text: str, max_length: int = 1000) -> str:
    """
    Sanitize text input to prevent injection attacks
    """
    if not isinstance(text, str):
        return ''
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\';\\]', '', text)
    
    # Limit length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip()

def validate_pagination_params(page: Any, per_page: Any) -> Dict[str, Any]:
    """
    Validate pagination parameters
    """
    try:
        page = int(page) if page else 1
        per_page = int(per_page) if per_page else 10
        
        # Ensure reasonable limits
        page = max(1, page)
        per_page = max(1, min(100, per_page))  # Limit to 100 items per page
        
        return {
            'valid': True,
            'page': page,
            'per_page': per_page
        }
    except (ValueError, TypeError):
        return {
            'valid': False,
            'error': 'Invalid pagination parameters',
            'page': 1,
            'per_page': 10
        }

