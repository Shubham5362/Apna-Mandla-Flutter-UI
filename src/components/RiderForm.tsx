import React, { useState, useEffect } from 'react';
import { Bike, ArrowLeft, CheckCircle, Clock, AlertCircle, Camera, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface ApplicationData {
  vehicleType: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  aadhaarPhoto?: string;
  panPhoto?: string;
  licensePhoto?: string;
  rcPhoto?: string;
  vehiclePhoto?: string;
}

export const RiderForm = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    vehicleType: 'Bike',
    phone: '',
    aadhaarPhoto: '',
    panPhoto: '',
    licensePhoto: '',
    rcPhoto: '',
    vehiclePhoto: '',
  });
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Mocking application check for now
    setLoading(false);
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (formData.phone.length !== 10) {
      console.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.aadhaarPhoto || !formData.panPhoto || !formData.licensePhoto || !formData.rcPhoto || !formData.vehiclePhoto) {
      console.error('All document photos are mandatory');
      return;
    }

    setSubmitting(true);
    try {
      // API call execution
      setApplication({
        ...formData,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const ImageInput = ({ label, field, value }: { label: string, field: string, value: string }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, field)}
          className="hidden"
          id={`file-${field}`}
        />
        <label
          htmlFor={`file-${field}`}
          className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
            value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-400'
          }`}
        >
          {value ? (
            <div className="relative w-full h-full p-2">
              <img src={value} alt={label} className="w-full h-full object-contain rounded-lg" />
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <>
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">Upload {label}</span>
            </>
          )}
        </label>
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (application) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <button onClick={onBack} className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {application.status === 'pending' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Application Pending</h1>
            <p className="text-gray-500 max-w-xs mx-auto">
              Your rider application has been submitted. 
              Our admin team will review your documents shortly.
            </p>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-700 text-sm font-medium">
              Status: PENDING FOR APPROVAL
            </div>
          </motion.div>
        )}

        {application.status === 'rejected' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Application Rejected</h1>
            <p className="text-gray-500 max-w-xs mx-auto">
              We're sorry, but your rider application was not approved. Please check your documents and try again.
            </p>
            <button 
              onClick={() => setApplication(null)}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {application.status === 'approved' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Congratulations!</h1>
            <p className="text-gray-500">You are now an approved Rider for Apna Mandla.</p>
            <p className="text-sm font-bold text-green-600">Please restart the app to see your Rider Dashboard.</p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-24 no-scrollbar">
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Become a Rider</h1>
      </header>

      <div className="p-6">
        <div className="bg-blue-600 p-8 rounded-3xl text-white mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Earn with Apna Mandla</h2>
            <p className="text-white/80 text-sm">Join our delivery fleet and earn by delivering products locally.</p>
          </div>
          <Bike className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Vehicle Type</label>
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Bicycle</option>
              <option>Bike / Scooter</option>
              <option>Electric Vehicle</option>
              <option>Auto Rickshaw</option>
              <option>Mini Truck</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Contact Number</label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <ImageInput label="Aadhaar Card Photo" field="aadhaarPhoto" value={formData.aadhaarPhoto} />
            <ImageInput label="PAN Card Photo" field="panPhoto" value={formData.panPhoto} />
            <ImageInput label="Driving License Photo" field="licensePhoto" value={formData.licensePhoto} />
            <ImageInput label="Vehicle RC Photo" field="rcPhoto" value={formData.rcPhoto} />
            <ImageInput label="Vehicle Photo" field="vehiclePhoto" value={formData.vehiclePhoto} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Rider Application'}
          </button>
        </form>
      </div>
    </div>
  );
};
