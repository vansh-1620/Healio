DISEASE_RULES = [
    {
        'name':'Common Cold',
        'must': {'cough':['mild','moderate'], 'runny_nose':['mild','moderate']},
        'score': 1
    },
    {
        'name':'Flu',
        'must': {'fever':['moderate','severe'], 'body_ache':['moderate','severe'], 'cough':['mild','moderate','severe']},
        'score': 2
    },
    {
        'name':'COVID-19',
        'must': {'fever':['mild','moderate','severe'], 'cough':['mild','moderate','severe'], 'loss_of_smell':['moderate','severe']},
        'score': 3
    },
    {
        'name':'Allergic Rhinitis',
        'must': {'sneezing':['mild','moderate','severe'], 'itchy_eyes':['mild','moderate']},
        'score': 1
    }
]

SEVERITY_WEIGHT = {'none':0, 'mild':1, 'moderate':2, 'severe':3}


def analyze_symptoms(symptoms: dict):
    """Input: symptoms dict e.g. {'fever':'mild','cough':'severe'}
    Returns a ranked list of possible diseases with confidence score (0-100).
    """
    scores = []
    # Basic scoring: sum weights for symptoms that match rule "must" keys
    for rule in DISEASE_RULES:
        rule_score = 0
        matched = 0
        for s_key, allowed in rule['must'].items():
            user_val = symptoms.get(s_key,'none')
            if user_val in allowed:
                matched += 1
                rule_score += SEVERITY_WEIGHT.get(user_val,0)
        # Normalize: proportion of matched required symptoms
        required = len(rule['must'])
        conf = 0
        if required>0:
            conf = (matched/required) * (rule_score/(required*3) if required*3>0 else 0)
        scores.append({'disease': rule['name'], 'confidence': round(conf*100,1)})
    # Also include heuristic diseases based on high fever
    if SEVERITY_WEIGHT.get(symptoms.get('fever','none'),0) >= 2 and symptoms.get('breathlessness') in ['moderate','severe']:
        scores.append({'disease':'Pneumonia (possible)', 'confidence': 65.0})
    # Sort by confidence
    scores.sort(key=lambda x: x['confidence'], reverse=True)
    return scores
