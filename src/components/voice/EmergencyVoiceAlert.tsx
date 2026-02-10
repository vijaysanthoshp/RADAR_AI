'use client';

/**
 * Emergency Voice Alert Component
 * Automatically speaks critical alerts when vitals reach dangerous levels
 */

import React, { useEffect, useRef } from 'react';
import { useVoice } from '@/contexts/VoiceContext';
import { useSensorData } from '@/components/data/sensor-context';
import { AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ==================== ALERT MESSAGES ====================

const ALERT_MESSAGES = {
  en: {
    CRITICAL: 'Critical alert! Your vital signs require immediate medical attention. Please contact your doctor or go to emergency room now.',
    RED: 'High risk alert detected. Your vitals are concerning. Please monitor closely and prepare to contact medical help.',
    ORANGE: 'Warning: Your vitals are outside the normal range. Please rest and monitor your condition.',
    YELLOW: 'Caution: Slight variation detected in your vitals. Please stay aware of your condition.',
    
    // Specific parameter alerts
    urea_high: 'Your urea level is elevated at {value} milligrams per deciliter. This may indicate kidney stress.',
    urea_critical: 'Critical: Your urea level is dangerously high at {value}. Immediate medical attention required.',
    
    fluid_high: 'Your fluid retention is elevated with ratio {value}. Monitor for swelling and breathing difficulty.',
    fluid_critical: 'Critical: Severe fluid retention detected at ratio {value}. Seek immediate medical help.',
    
    hr_high: 'Your heart rate is elevated at {value} beats per minute. Please rest and stay calm.',
    hr_low: 'Your heart rate is low at {value} beats per minute. Avoid sudden movements.',
    hr_critical: 'Critical heart rate at {value} beats per minute. Emergency assistance required.',
    
    spo2_low: 'Your oxygen saturation is low at {value} percent. Take slow deep breaths.',
    spo2_critical: 'Critical: Oxygen level dangerously low at {value} percent. Emergency help needed now.',
  },
  
  hi: {
    CRITICAL: 'गंभीर चेतावनी! आपके महत्वपूर्ण संकेतों को तत्काल चिकित्सा ध्यान की आवश्यकता है। कृपया अपने डॉक्टर से संपर्क करें या तुरंत आपातकालीन कक्ष में जाएं।',
    RED: 'उच्च जोखिम चेतावनी। आपके महत्वपूर्ण संकेत चिंताजनक हैं। कृपया बारीकी से निगरानी करें और चिकित्सा सहायता से संपर्क करने के लिए तैयार रहें।',
    ORANGE: 'चेतावनी: आपके महत्वपूर्ण संकेत सामान्य सीमा से बाहर हैं। कृपया आराम करें और अपनी स्थिति की निगरानी करें।',
    YELLOW: 'सावधानी: आपके महत्वपूर्ण संकेतों में मामूली विविधता का पता चला है। कृपया अपनी स्थिति के बारे में सचेत रहें।',
    
    urea_high: 'आपका यूरिया स्तर {value} मिलीग्राम प्रति डेसीलीटर पर बढ़ा हुआ है। यह गुर्दे के तनाव का संकेत हो सकता है।',
    urea_critical: 'गंभीर: आपका यूरिया स्तर {value} पर खतरनाक रूप से उच्च है। तत्काल चिकित्सा ध्यान आवश्यक है।',
    
    fluid_high: 'आपका द्रव प्रतिधारण अनुपात {value} पर बढ़ा हुआ है। सूजन और सांस लेने में कठिनाई के लिए निगरानी करें।',
    fluid_critical: 'गंभीर: गंभीर द्रव प्रतिधारण अनुपात {value} पर पाया गया। तत्काल चिकित्सा सहायता लें।',
    
    hr_high: 'आपकी हृदय गति {value} बीट प्रति मिनट पर बढ़ी हुई है। कृपया आराम करें और शांत रहें।',
    hr_low: 'आपकी हृदय गति {value} बीट प्रति मिनट पर कम है। अचानक हलचल से बचें।',
    hr_critical: 'गंभीर हृदय गति {value} बीट प्रति मिनट पर। आपातकालीन सहायता की आवश्यकता है।',
    
    spo2_low: 'आपका ऑक्सीजन संतृप्ति {value} प्रतिशत पर कम है। धीरे-धीरे गहरी सांस लें।',
    spo2_critical: 'गंभीर: ऑक्सीजन स्तर {value} प्रतिशत पर खतरनाक रूप से कम। तुरंत आपातकालीन सहायता आवश्यक।',
  },
  
  ta: {
    CRITICAL: 'முக்கியமான எச்சரிக்கை! உங்கள் உயிர் அறிகுறிகளுக்கு உடனடி மருத்துவ கவனம் தேவை. உங்கள் மருத்துவரை தொடர்பு கொள்ளவும் அல்லது உடனடியாக அவசர அறைக்கு செல்லவும்.',
    RED: 'அதிக ஆபத்து எச்சரிக்கை கண்டறியப்பட்டது. உங்கள் உயிர் அறிகுறிகள் கவலைக்குரியவை. தயவுசெய்து நெருக்கமாக கண்காணிக்கவும் மற்றும் மருத்துவ உதவியை தொடர்பு கொள்ள தயாராக இருக்கவும்.',
    ORANGE: 'எச்சரிக்கை: உங்கள் உயிர் அறிகுறிகள் இயல்பான வரம்பிற்கு வெளியே உள்ளன. தயவுசெய்து ஓய்வெடுக்கவும் மற்றும் உங்கள் நிலையை கண்காணிக்கவும்.',
    YELLOW: 'எச்சரிக்கை: உங்கள் உயிர் அறிகுறிகளில் சிறிது மாறுபாடு கண்டறியப்பட்டது. உங்கள் நிலை குறித்து விழிப்புடன் இருக்கவும்.',
    
    urea_high: 'உங்கள் யூரியா அளவு {value} மில்லிகிராம் ஒரு டெசிலிட்டரில் உயர்ந்துள்ளது. இது சிறுநீரக அழுத்தத்தை குறிக்கலாம்.',
    urea_critical: 'முக்கியமானது: உங்கள் யூரியா அளவு {value} இல் ஆபத்தான முறையில் உயர்ந்துள்ளது. உடனடி மருத்துவ கவனம் தேவை.',
    
    fluid_high: 'உங்கள் திரவ தக்கவைப்பு {value} விகிதத்தில் உயர்ந்துள்ளது. வீக்கம் மற்றும் சுவாசிப்பதில் சிரமத்திற்கு கண்காணிக்கவும்.',
    fluid_critical: 'முக்கியமானது: கடுமையான திரவ தக்கவைப்பு {value} விகிதத்தில் கண்டறியப்பட்டது. உடனடி மருத்துவ உதவியைப் பெறவும்.',
    
    hr_high: 'உங்கள் இதய துடிப்பு {value} ஒரு நிமிடத்திற்கு துடிக்கிறது. தயவுசெய்து ஓய்வெடுக்கவும் மற்றும் அமைதியாக இருக்கவும்.',
    hr_low: 'உங்கள் இதய துடிப்பு {value} ஒரு நிமிடத்திற்கு குறைவாக உள்ளது. திடீர் அசைவுகளை தவிர்க்கவும்.',
    hr_critical: 'முக்கியமான இதய துடிப்பு {value} ஒரு நிமிடத்திற்கு. அவசர உதவி தேவை.',
    
    spo2_low: 'உங்கள் ஆக்ஸிஜன் செறிவூட்டல் {value} சதவீதத்தில் குறைவாக உள்ளது. மெதுவான ஆழமான மூச்சுகளை எடுக்கவும்.',
    spo2_critical: 'முக்கியமானது: ஆக்ஸிஜன் அளவு {value} சதவீதத்தில் ஆபத்தான முறையில் குறைவாக உள்ளது. இப்போதே அவசர உதவி தேவை.',
  },
  
  te: {
    CRITICAL: 'క్లిష్టమైన హెచ్చరిక! మీ ముఖ్యమైన సంకేతాలకు తక్షణ వైద్య శ్రద్ధ అవసరం. దయచేసి మీ వైద్యుడిని సంప్రదించండి లేదా వెంటనే అత్యవసర గదికి వెళ్లండి.',
    RED: 'అధిక ప్రమాద హెచ్చరిక గుర్తించబడింది. మీ ముఖ్యమైన సంకేతాలు ఆందోళనకరంగా ఉన్నాయి. దయచేసి దగ్గరగా పర్యవేక్షించండి మరియు వైద్య సహాయాన్ని సంప్రదించడానికి సిద్ధంగా ఉండండి.',
    ORANGE: 'హెచ్చరిక: మీ ముఖ్యమైన సంకేతాలు సాధారణ పరిధి వెలుపల ఉన్నాయి. దయచేసి విశ్రాంతి తీసుకోండి మరియు మీ పరిస్థితిని పర్యవేక్షించండి.',
    YELLOW: 'జాగ్రత్త: మీ ముఖ్యమైన సంకేతాలలో స్వల్ప వైవిధ్యం గుర్తించబడింది. దయచేసి మీ పరిస్థితి గురించి అవగాహన కలిగి ఉండండి.',
    
    urea_high: 'మీ యూరియా స్థాయి {value} మిల్లిగ్రాములు ప్రతి డెసిలీటర్‌లో పెరిగింది. ఇది మూత్రపిండ ఒత్తిడిని సూచించవచ్చు.',
    urea_critical: 'క్లిష్టమైనది: మీ యూరియా స్థాయి {value} వద్ద ప్రమాదకరంగా ఎక్కువగా ఉంది. తక్షణ వైద్య శ్రద్ధ అవసరం.',
    
    fluid_high: 'మీ ద్రవ నిలుపుదల {value} నిష్పత్తిలో పెరిగింది. వాపు మరియు శ్వాస తీసుకోవడంలో కష్టం కోసం పర్యవేక్షించండి.',
    fluid_critical: 'క్లిష్టమైనది: తీవ్రమైన ద్రవ నిలుపుదల {value} నిష్పత్తిలో గుర్తించబడింది. తక్షణ వైద్య సహాయం పొందండి.',
    
    hr_high: 'మీ హృదయ స్పందన {value} నిమిషానికి కొట్టుకునే వేగం పెరిగింది. దయచేసి విశ్రాంతి తీసుకోండి మరియు ప్రశాంతంగా ఉండండి.',
    hr_low: 'మీ హృదయ స్పందన {value} నిమిషానికి కొట్టుకునే వేగం తక్కువగా ఉంది. అకస్మాత్ కదలికలను తప్పించండి.',
    hr_critical: 'క్లిష్టమైన హృదయ స్పందన {value} నిమిషానికి కొట్టుకునే వేగం. అత్యవసర సహాయం అవసరం.',
    
    spo2_low: 'మీ ఆక్సిజన్ సంతృప్తత {value} శాతంలో తక్కువగా ఉంది. నెమ్మదిగా లోతైన శ్వాసలు తీసుకోండి.',
    spo2_critical: 'క్లిష్టమైనది: ఆక్సిజన్ స్థాయి {value} శాతంలో ప్రమాదకరంగా తక్కువగా ఉంది. ఇప్పుడే అత్యవసర సహాయం అవసరం.',
  },
};

// ==================== COMPONENT ====================

export const EmergencyVoiceAlert: React.FC = () => {
  const { speak, autoSpeak, voiceEnabled, toggleAutoSpeak, language } = useVoice();
  const { data: latestData } = useSensorData();
  
  const previousUrgencyRef = useRef<string>('GREEN');
  const lastAlertTimeRef = useRef<Record<string, number>>({});
  const isAlertingRef = useRef(false);

  useEffect(() => {
    if (!autoSpeak || !voiceEnabled || !latestData || isAlertingRef.current) return;

    const currentTime = Date.now();
    const urgency = latestData.urgency || 'GREEN';
    
    // Cooldown periods (prevent spam)
    const cooldownPeriods: Record<string, number> = {
      CRITICAL: 30000, // 30 seconds
      RED: 60000, // 1 minute
      ORANGE: 120000, // 2 minutes
      YELLOW: 180000, // 3 minutes
      GREEN: 300000, // 5 minutes
    };

    // Only speak if urgency level increased
    const urgencyLevels = ['GREEN', 'YELLOW', 'ORANGE', 'RED', 'CRITICAL'];
    const currentLevel = urgencyLevels.indexOf(urgency);
    const previousLevel = urgencyLevels.indexOf(previousUrgencyRef.current);
    const urgencyIncreased = currentLevel > previousLevel;
    
    const cooldownPassed = !lastAlertTimeRef.current[urgency] || 
                          (currentTime - lastAlertTimeRef.current[urgency]) > cooldownPeriods[urgency];

    if (urgencyIncreased && urgency !== 'GREEN') {
      isAlertingRef.current = true;
      speakAlert(urgency, latestData);
      lastAlertTimeRef.current[urgency] = currentTime;
      previousUrgencyRef.current = urgency;
      // Reset alerting flag after a delay
      setTimeout(() => {
        isAlertingRef.current = false;
      }, 3000);
    }
  }, [latestData?.urgency, autoSpeak, voiceEnabled]);

  const speakAlert = (urgency: string, data: any) => {
    const messages = ALERT_MESSAGES[language as keyof typeof ALERT_MESSAGES] || ALERT_MESSAGES.en;
    
    // General alert message
    const generalMessage = messages[urgency as keyof typeof messages] as string;
    
    // Specific parameter alerts
    const specificAlerts: string[] = [];
    
    // Check Urea
    if (data.urea > 120) {
      specificAlerts.push(
        (messages.urea_critical as string).replace('{value}', data.urea.toFixed(1))
      );
    } else if (data.urea > 80) {
      specificAlerts.push(
        (messages.urea_high as string).replace('{value}', data.urea.toFixed(1))
      );
    }
    
    // Check Fluid
    if (data.fluid > 0.48) {
      specificAlerts.push(
        (messages.fluid_critical as string).replace('{value}', data.fluid.toFixed(3))
      );
    } else if (data.fluid > 0.45) {
      specificAlerts.push(
        (messages.fluid_high as string).replace('{value}', data.fluid.toFixed(3))
      );
    }
    
    // Check Heart Rate
    if (data.hr > 140 || data.hr < 50) {
      specificAlerts.push(
        (messages.hr_critical as string).replace('{value}', data.hr.toFixed(0))
      );
    } else if (data.hr > 120) {
      specificAlerts.push(
        (messages.hr_high as string).replace('{value}', data.hr.toFixed(0))
      );
    } else if (data.hr < 60) {
      specificAlerts.push(
        (messages.hr_low as string).replace('{value}', data.hr.toFixed(0))
      );
    }
    
    // Check SpO2
    if (data.spo2 < 85) {
      specificAlerts.push(
        (messages.spo2_critical as string).replace('{value}', data.spo2.toFixed(1))
      );
    } else if (data.spo2 < 90) {
      specificAlerts.push(
        (messages.spo2_low as string).replace('{value}', data.spo2.toFixed(1))
      );
    }
    
    // Combine messages
    const fullMessage = [generalMessage, ...specificAlerts].join(' ');
    
    // Speak with appropriate urgency
    const voiceUrgency = urgency === 'CRITICAL' || urgency === 'RED' ? 'critical' : 
                        urgency === 'ORANGE' ? 'urgent' : 'normal';
    
    speak(fullMessage, { urgency: voiceUrgency, priority: urgency === 'CRITICAL' });
  };

  // Manual test alert
  const testAlert = () => {
    const messages = ALERT_MESSAGES[language as keyof typeof ALERT_MESSAGES] || ALERT_MESSAGES.en;
    speak(messages.YELLOW as string, { urgency: 'normal' });
  };

  return (
    <Card className="p-4 border-2 border-orange-500/30 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Emergency Voice Alerts</h3>
            <p className="text-xs text-muted-foreground">
              Auto-speak critical health warnings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={autoSpeak ? "default" : "outline"}>
            {autoSpeak ? 'Enabled' : 'Disabled'}
          </Badge>
          
          <Button
            size="sm"
            variant={autoSpeak ? "default" : "outline"}
            onClick={toggleAutoSpeak}
            disabled={!voiceEnabled}
            className="gap-2"
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {autoSpeak ? 'On' : 'Off'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={testAlert}
            disabled={!voiceEnabled}
          >
            Test
          </Button>
        </div>
      </div>

      {!voiceEnabled && (
        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
          ⚠️ Voice is disabled. Enable voice to receive emergency alerts.
        </div>
      )}
    </Card>
  );
};
