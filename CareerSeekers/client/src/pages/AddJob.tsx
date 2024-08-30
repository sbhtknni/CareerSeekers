import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddJob() {
    const [formData, setFormData] = useState<{
        jobName: string;
        Description: string;
        AverageSalary: string;
        jobField: string;
        facebookPostUrl: string;
        Prerequisites: {
            Business: number;
            GeneralCulture: number;
            ArtsAndEntertainment: number;
            Science: number;
            Organization: number;
            Service: number;
            Outdoor: number;
            Technology: number;
        };
        GeneralRequirements: string[],
        standardDay: '',
        education: '',
        technicalSkills: '',
        workLifeBalance: '';
    }>({
        jobName: '',
        Description: '',
        AverageSalary: '',
        jobField: '',
        facebookPostUrl: '',
        Prerequisites: {
            Business: 0,
            GeneralCulture: 0,
            ArtsAndEntertainment: 0,
            Science: 0,
            Organization: 0,
            Service: 0,
            Outdoor: 0,
            Technology: 0,
        },
        GeneralRequirements: [],
        standardDay: '',
        education: '',
        technicalSkills: '',
        workLifeBalance: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasFacebookPost, setHasFacebookPost] = useState<string>('No');
    const [insertRamakTraits, setInsertRamakTraits] = useState<string>('No');
    const [newRequirement, setNewRequirement] = useState<string>('');
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name in formData.Prerequisites) {
            setFormData({
                ...formData,
                Prerequisites: {
                    ...formData.Prerequisites,
                    [name]: Number(value)
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle adding new requirement
    const handleAddRequirement = () => {
        if (newRequirement.trim()) {
            setFormData({
                ...formData,
                GeneralRequirements: [...formData.GeneralRequirements, newRequirement.trim()]
            });
            setNewRequirement('');
        }
    };

    // Handle removing a requirement
    const handleRemoveRequirement = (index: number) => {
        setFormData({
            ...formData,
            GeneralRequirements: formData.GeneralRequirements.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation check for Facebook post URL
        if (hasFacebookPost === 'Yes' && !formData.facebookPostUrl) {
            setError('Please enter the URL of the Facebook post.');
            return;
        }

        // Validation check for Average Salary
        if (Number(formData.AverageSalary) <= 0) {
            setError('Average Salary must be a positive number.');
            return;
        }

        // Additional validation checks
        if (insertRamakTraits === 'No' && formData.GeneralRequirements.length === 0) {
            setError('Please add at least one general requirement.');
            return;
        }

        if (insertRamakTraits === 'Yes') {
            const prerequisitesSum = Object.values(formData.Prerequisites).reduce((sum, val) => sum + val, 0);
            if (prerequisitesSum !== 100) {
                setError('The sum of all Prerequisites must be equal to 100.');
                return;
            }
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/server/job/addjob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!data.success) {
                setError(data.message);
                setLoading(false);
                return;
            }
            setTimeout(() => {
                setLoading(false);
                toast.success('Job added successfully!', {
                    position: 'top-center',
                    autoClose: 2000,
                    onClose: () => navigate('/adminpanel')
                });
            }, 1000);
        } catch (err) {
            setError('Failed to add job. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 p-4" dir='rtl'>
            <ToastContainer />
            <div className="md:w-2/5 mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden ">
                <h1 className="text-2xl font-bold text-center py-2 bg-slate-700 text-white mt-20">הוספת מקצוע חדש</h1>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Job Details Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700 border-b pb-2">פרטי המקצוע</h2>
                        <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="jobName" className="block text-xl font-semibold text-slate-700">שם המקצוע</label>
          <input
            type="text"
            id="jobName"
            name="jobName"
            value={formData.jobName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-xl font-semibold text-slate-700">תיאור</label>
          <textarea
            id="description"
            name="description"
            value={formData.Description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent h-24"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="standardDay" className="block text-xl font-semibold text-slate-700">תיאור יום עבודה סטנדרטי במקצוע</label>
          <textarea
            id="standardDay"
            name="standardDay"
            value={formData.standardDay}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent h-24"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="education" className="block text-xl font-semibold text-slate-700">השכלה</label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent h-24"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="technicalSkills" className="block text-xl font-semibold text-slate-700">כישורים טכניים הנדרשים למקצוע</label>
          <textarea
            id="technicalSkills"
            name="technicalSkills"
            value={formData.technicalSkills}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent h-24"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="workLifeBalance" className="block text-xl font-semibold text-slate-700">איזון עבודה-חיים</label>
          <textarea
            id="workLifeBalance"
            name="workLifeBalance"
            value={formData.workLifeBalance}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent h-24"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="averageSalary" className="block text-xl font-semibold text-slate-700">שכר ממוצע</label>
            <input
              type="number"
              id="averageSalary"
              name="averageSalary"
              value={formData.AverageSalary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="jobField" className="block text-xl font-semibold text-slate-700">תחום מקצועי</label>
            <select
              id="jobField"
              name="jobField"
              value={formData.jobField}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-gray-700"
              required
            >
              <option value="" disabled>בחר תחום מקצועי</option>
              <option value="Business">עסקים</option>
              <option value="GeneralCulture">תרבות כללית</option>
              <option value="ArtsAndEntertainment">אמנות ובידור</option>
              <option value="Science">מדע</option>
              <option value="Organization">ארגון</option>
              <option value="Service">שירות</option>
              <option value="Outdoor">חוץ</option>
              <option value="Technology">טכנולוגיה</option>
            </select>
          </div>
          </div>
    
                            <div>
                            <div className="space-y-2">
          <label htmlFor="hasFacebookPost" className="block text-xl font-semibold text-slate-700">
            האם יש לינק למידע אודות המקצוע?
          </label>
          <select
            id="hasFacebookPost"
            name="hasFacebookPost"
            value={hasFacebookPost}
            onChange={(e) => setHasFacebookPost(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-gray-700"
          >
            <option value="No">לא</option>
            <option value="Yes">כן</option>
          </select>
        </div>

        {hasFacebookPost === 'Yes' && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="הכנס קישור של תיאור המקצוע"
              name="facebookPostUrl"
              value={formData.facebookPostUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="insertRamakTraits" className="block text-xl font-semibold text-slate-700">
            כיצד לאפיין את תכונות המקצוע?
          </label>
          <select
            id="insertRamakTraits"
            name="insertRamakTraits"
            value={insertRamakTraits}
            onChange={(e) => setInsertRamakTraits(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-gray-700"
          >
            <option value="No">תכונות כלליות</option>
            <option value="Yes">תכונות שאלון RAMAK</option>
          </select>
        </div>

        </div>
        </div>
        </div>

                    {/* Conditionally render RAMAK Questionnaire Section */}
                    {insertRamakTraits === 'Yes' && (
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-6 text-slate-700 border-b pb-2">RAMAK איפיון ע"י תכונות</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.keys(formData.Prerequisites).map((key) => (
                                    <div key={key} className="flex flex-col">
                                        <label htmlFor={key} className="text-lg font-medium text-slate-600">
                                            {key}
                                        </label>
                                        <input
                                            type="number"
                                            name={key}
                                            value={formData.Prerequisites[key as keyof typeof formData.Prerequisites]}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Conditionally render General Requirements Section */}
                    {insertRamakTraits === 'No' && (
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4 text-slate-700 border-b pb-2">איפיון ע"י תכונות כלליות</h2>
                            <div className="flex items-center mb-4">
                                <input
                                    type="text"
                                    placeholder="הכנס תכונה"
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent mr-2"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddRequirement}
                                    className="bg-slate-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                                >
                                    הוספה
                                </button>
                            </div>
                            {formData.GeneralRequirements.length > 0 && (
                                <ul className="space-y-2">
                                    {formData.GeneralRequirements.map((req, index) => (
                                        <li key={index} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
                                            <span>{req}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRequirement(index)}
                                                className="text-red-500 focus:outline-none"
                                            >
                                                הסרה
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="md:w-1/5 block mx-auto bg-slate-700 text-white px-8 py-2 rounded-md shadow-md hover:bg-slate-800 transition duration-150 ease-in-out"
                    >
                        {loading ? 'Loading...' : 'הכנס מקצוע'}
                    </button>
                    {error && <p className="text-center text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
}
